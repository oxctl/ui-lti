import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Spinner } from '@instructure/ui-spinner';
import ErrorBillboard from "../errorBillboard/ErrorBillboard";

type TokenRetrieverState = {
  loading: boolean
  error: string | null
}

type LtiTokenRetrieverProps = {
  ltiServer?: string | null
  handleJwt: (jwt: string, server: string) => void
  children: React.ReactNode
  location?: Location
}

/**
 * Looks for a one time token in the URL parameters and then attempts to use this to retrieve a JWT token
 * from the LTI launch service. If the token can't be retrieved then is displays a nice error message.
 *
 * Error cases we handle:
 * - no token in the URL
 * - token cannot be retrieved
 */
export const LtiTokenRetriever = ({ ltiServer, handleJwt, children, location = window.location }: LtiTokenRetrieverProps) => {
  const [state, setState] = useState<TokenRetrieverState>({
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchToken = async () => {
      const token = getToken();
      const server = getServer();

      if (!token) {
        setState({ loading: false, error: "No id found to load token with" });
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
        if (!jwt) {
          throw new Error("Failed to load token.");
        }

          handleJwt(jwt, server);
          saveJwt(jwt);
          setState({ loading: false, error: null });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load token.";
        setState({ loading: false, error: message });
      }
    };

    fetchToken();
  }, [ltiServer]);
  
  // Log a warning if the value of handleJwt changes as it's not how the component should be used.
  const handleJwtRef = useRef(handleJwt);

  useEffect(() => {
    if (handleJwtRef.current !== handleJwt) {
      // Helpful developer warning — prefer using a stable callback (e.g. useCallback) so
      // the component doesn't see handleJwt as changing every render.
      try {
        console.warn(
          'LtiTokenRetriever: prop `handleJwt` changed. This component should have a stable callback (avoid creating a new function each render, ie useCallback()).'
        );
      } catch (e) {
      }
    }
    // Update ref after comparison so initial mount won't trigger the warning.
    handleJwtRef.current = handleJwt;
  }, [handleJwt]);
  

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

  const saveJwt = (jwt: string | null) => {
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

  const loadJwt = (): string | null => {
    try {
      const stored = localStorage.getItem('jwt');
      if (!stored) return null;
      const data = JSON.parse(stored);
      if (!data) return null;

      return data.token ?? null;
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
