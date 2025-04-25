import React from 'react';

import LtiTokenRetriever from './LtiTokenRetriever.jsx';
import {http, delay, HttpResponse} from "msw";

const Template = (args) =>
    <LtiTokenRetriever {...args}>
      <div>Token retrieved</div>
    </LtiTokenRetriever>

export const NoToken = Template.bind({})
NoToken.args = {
  handleJwt: () => {},
  ltiServer: 'https://example.com',
  location: {search: '?token=1234'}
};
NoToken.parameters = {
  msw: {
    handlers: [
      http.post('https://example.com/token', async () => {
        await delay();
        return HttpResponse.error({ status: 404, body: "Token not found" });
      })
    ]
  }
}

export const Success = Template.bind({});
Success.args = {
  handleJwt: (jwt, server) => console.log('JWT retrieved:', jwt, 'from server:', server),
  ltiServer: 'https://example.com',
  location: {search: '?token=1234'}
};
Success.parameters = {
  msw: {
    handlers: [
      http.post('https://example.com/token', async () => {
        await delay();
        return HttpResponse.json({ jwt: 'sample.jwt.token' });
      })
    ]
  }
};

export default {
  title: 'Components/LtiTokenRetriever',
  component: LtiTokenRetriever,
  parameters: {
    msw: {
      handlers: []
    },
    docs: {
      description: {
        component: 'Handles retrieving and managing LTI JSON Web Tokens (JWT) for Canvas LMS tools.'
      }
    }
  },
  argTypes: {
    handleJwt: {action: 'JWT Retrieved'},
    ltiServer: {control: 'text'},
    location: {control: 'object'}
  },
  tags: ['autodocs']
};
