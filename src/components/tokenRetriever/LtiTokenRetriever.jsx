import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Spinner } from '@instructure/ui-spinner';
import ErrorBillboard from "../errorBillboard/ErrorBillboard.jsx";

/**
 * Looks for a one time token in the URL parameters and then attempts to use this to retrieve a JWT token
 * from the LTI launch service. If the token can't be retrieved then is displays a nice error message.
 *
 * Error cases we handle:
 * - no token in the URL
 * - token cannot be retrieved
 */
export const LtiTokenRetriever = ({ ltiServer, handleJwt, children, location = window.location }) => {
  const [state, setState] = useState({
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchToken = async () => {
      const token = getToken();
      const server = getServer();

      if (!token) {
        setState({ loading: false, error: "No token found to load" });
        return;
      }

      if (!server) {
        setState({ loading: false, error: "No server found to load from" });
        return;
      }

      try {
        const formData = new FormData();
        formData.append('key', token);

        const response = await fetch(`${server}/token`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Sorry the tool is not currently available to you.");
          }

          // Try to get cached JWT
          const cachedJwt = loadJwt();
          if (!cachedJwt) {
            throw new Error("Failed to load token.");
          }

          handleJwt(cachedJwt, server);
          setState({ loading: false, error: null });
          return;
        }

        const json = await response.json();
        const jwt = json.jwt || json.token_value;

        handleJwt(jwt, server);
        saveJwt(jwt);
        setState({ loading: false, error: null });
      } catch (error) {
        setState({ loading: false, error: error.message });
      }
    };

    fetchToken();
  }, [handleJwt, ltiServer]);

  const getToken = () => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    return token ? decodeURIComponent(token) : null;
  };

  const getServer = () => {
    if (ltiServer) return ltiServer;

    const params = new URLSearchParams(location.search);
    const server = params.get('server');
    return server ? decodeURIComponent(server) : null;
  };

  const saveJwt = (jwt) => {
    if (!jwt) return;

    try {
      // Store with timestamp for potential expiration check
      const tokenData = {
        token: jwt,
        timestamp: Date.now()
      };
      sessionStorage.setItem("jwt", JSON.stringify(tokenData));
    } catch (e) {
      if (!(e instanceof DOMException)) {
        throw e;
      }
    }
  };

  const loadJwt = () => {
    try {
      const data = JSON.parse(sessionStorage.getItem('jwt'));
      if (!data) return null;

      return data.token;
    } catch (e) {
      if (!(e instanceof DOMException)) {
        throw e;
      }
      return null;
    }
  };

  const renderLoading = () => (
      <Spinner
          size="large"
          margin="large"
          renderTitle="Loading data..."
      />
  );

  return (
      <ErrorBillboard message={state.error}>
        {state.loading ? renderLoading() : children}
      </ErrorBillboard>
  );
};

LtiTokenRetriever.propTypes = {
   /**
    * The URL to the LTI server to get the token from, if it's not supplied we look in the URL for a parameter. */
  ltiServer: PropTypes.string,
  /**
   * Callback that is passed the loaded JWT and the server. Only called on successful loading of the JWT.
   * The server is useful if further requests need to be made (eg for NRPS calls or deep linking).
   */
  handleJwt: PropTypes.func.isRequired,
  /**
   * The application node to render as long as we're all good.
   */
  children: PropTypes.node.isRequired,
  /**
   * The location object to extract the URL parameters from. This is useful for testing.
   */
  location: PropTypes.object
};

export default LtiTokenRetriever;