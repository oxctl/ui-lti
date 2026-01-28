import React from 'react'
import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import LtiTokenRetriever from "./LtiTokenRetriever";
import {setupServer} from "msw/node";
import {delay, http, HttpResponse} from "msw";

const mockJwtFn = vi.fn();
const mockServer = 'http://server.test';

describe('LtiTokenRetriever Test Suite', () => {
    const jwt = 'not.really.a.token'
    const restHandlers = [
        http.post('http://server.test/token', () => {
            return HttpResponse.json({jwt})
        })
    ]

    const server = setupServer(...restHandlers)

    // Start server before all tests
    beforeAll(() => server.listen({onUnhandledRequest: 'error'}))

    //  Close server after all tests
    afterAll(() => server.close())

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers())

    it('Should show an error when no token', () => {
        render(
            <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(screen.getByText('No id found to load token with')).toBeDefined()
    });

    it('Should find token in URL', () => {
        const search = '?token=1234'
        vi.spyOn(window, 'location', 'get').mockReturnValue({search})

        render(
            <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(screen.getByText('Loading data...')).toBeDefined()
    })

    it('Should find token in URL (when other parameters present)', () => {
        const search = '?token=1234&other=something'
        vi.spyOn(window, 'location', 'get').mockReturnValue({search})
        // Technically this isn't necessary, because when the component is mounted it's loading.
        // But it means if we refactor the code it should continue working.
        server.use(
            http.post('http://server.test/token', async () => {
                await delay('infinite')
            })
        )
        render(
            <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(screen.getByText('Loading data...')).toBeDefined()
    })

    it('Should show nice error when network error occurs', async () => {
        const search = '?token=1234&other=something'
        vi.spyOn(window, 'location', 'get').mockReturnValue({search})
        server.use(
            http.post('http://server.test/token', async () => {
                return HttpResponse.error()
            })
        )
        render(
            <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(await screen.findByText('Failed to fetch')).toBeDefined()
    })

    it('Should show nice message when no permissions', async () => {
        const search = '?token=1234&other=something'
        vi.spyOn(window, 'location', 'get').mockReturnValue({search})
        server.use(
            http.post('http://server.test/token', async () => {
                return HttpResponse.text('No permissions', {status: 403})
            })
        )
        render(
            <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(await screen.findByText('Sorry the tool is not currently available to you.')).toBeDefined()
    })

    it('Should follow happy path, extract token, get response from server', async () => {
        const search = `?token=1234&server=${mockServer}`
        vi.spyOn(window, 'location', 'get').mockReturnValue({search})
        render(
            <LtiTokenRetriever handleJwt={mockJwtFn}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(await screen.findAllByText('Mock Child Element')).toBeDefined()
        expect(mockJwtFn).toHaveBeenCalledWith(jwt, mockServer)
    })

    it('Happy path, extract token, get response from server, but we supply lti server', async () => {
        const search = `?token=1234`
        vi.spyOn(window, 'location', 'get').mockReturnValue({search})
        render(
            <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                <h1>Mock Child Element</h1>
            </LtiTokenRetriever>
        )
        expect(await screen.findAllByText('Mock Child Element')).toBeDefined()
        expect(mockJwtFn).toHaveBeenCalledWith(jwt, mockServer)
    })

    it('Does not make multiple fetch calls inside StrictMode', async () => {
        const search = `?token=1234`
        vi.spyOn(window, 'location', 'get').mockReturnValue({search})
        mockJwtFn.mockClear()
        let callCount = 0
        server.use(
            http.post('http://server.test/token', () => {
                callCount += 1
                return HttpResponse.json({jwt})
            })
        )
        render(
            <React.StrictMode>
                <LtiTokenRetriever handleJwt={mockJwtFn} ltiServer={mockServer}>
                    <h1>Mock Child Element</h1>
                </LtiTokenRetriever>
            </React.StrictMode>
        )
        expect(await screen.findAllByText('Mock Child Element')).toBeDefined()
        expect(callCount).toBe(1)
    })


});
