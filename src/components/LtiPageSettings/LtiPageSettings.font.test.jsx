import React from 'react'
import { createPortal } from 'react-dom'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InstUISettingsProvider, useTheme } from '@instructure/emotion'
import { canvasHighContrast } from '@instructure/ui-themes'
import { Text } from '@instructure/ui-text'
import { LtiPageSettings } from './LtiPageSettings'
import bundledFontUrl from './fonts/OpenDyslexic-Regular.woff2?url'
import bundledBoldFontUrl from './fonts/OpenDyslexic-Bold.woff2?url'
import bundledItalicFontUrl from './fonts/OpenDyslexic-Italic.woff2?url'
import bundledBoldItalicFontUrl from './fonts/OpenDyslexic-BoldItalic.woff2?url'

function fontFaces() {
  return [...document.styleSheets]
    .flatMap(sheet => [...sheet.cssRules])
    .filter(rule => rule.type === CSSRule.FONT_FACE_RULE
      && rule.style.getPropertyValue('font-family').includes('LtiOpenDyslexic-'))
}

function ThemeProbe() {
  const theme = useTheme()
  return <output data-testid="theme">{JSON.stringify(theme)}</output>
}

function PortaledText() {
  return createPortal(<Text>Portaled text</Text>, document.body)
}

describe('LtiPageSettings font support', () => {
  beforeEach(() => {
    vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
  })
  it('registers distinct bundled fonts for every weight and style combination', () => {
    render(<LtiPageSettings useDyslexicFont>All variants</LtiPageSettings>)
    const faces = fontFaces()
    expect(faces).toHaveLength(4)

    for (const [weight, style, url] of [
      ['400', 'normal', bundledFontUrl],
      ['700', 'normal', bundledBoldFontUrl],
      ['400', 'italic', bundledItalicFontUrl],
      ['700', 'italic', bundledBoldItalicFontUrl]
    ]) {
      expect(url).not.toMatch(/^data:/)
      const face = faces.find(rule => rule.style.getPropertyValue('font-weight') === weight
        && rule.style.getPropertyValue('font-style') === style)
      expect(face?.style.getPropertyValue('src')).toContain(url)
    }
    expect(new Set(faces.map(rule => rule.style.getPropertyValue('font-family'))).size).toBe(1)
  })

  it('overrides each variant independently and restores the bundled variants when URLs are removed', () => {
    const { rerender } = render(
      <LtiPageSettings
        useDyslexicFont
        fontUrl="/fonts/regular.woff2"
        boldFontUrl="/fonts/bold.woff2"
        italicFontUrl="/fonts/italic.woff2"
        boldItalicFontUrl="/fonts/bold-italic.woff2"
      >
        Custom variants
      </LtiPageSettings>
    )
    expect(fontFaces().map(rule => [
      rule.style.getPropertyValue('font-weight'),
      rule.style.getPropertyValue('font-style'),
      rule.style.getPropertyValue('src')
    ])).toEqual([
      ['400', 'normal', 'url("/fonts/regular.woff2")'],
      ['700', 'normal', 'url("/fonts/bold.woff2")'],
      ['400', 'italic', 'url("/fonts/italic.woff2")'],
      ['700', 'italic', 'url("/fonts/bold-italic.woff2")']
    ])

    rerender(<LtiPageSettings useDyslexicFont fontUrl="/fonts/regular.woff2">Mixed variants</LtiPageSettings>)
    for (const url of [bundledBoldFontUrl, bundledItalicFontUrl, bundledBoldItalicFontUrl]) {
      expect(document.head.textContent).toContain(url)
    }
    expect(document.head.textContent).toContain('/fonts/regular.woff2')
    expect(document.head.textContent).not.toContain(bundledFontUrl)
    expect(document.head.textContent).not.toContain('/fonts/bold.woff2')
    expect(document.head.textContent).not.toContain('/fonts/italic.woff2')
    expect(document.head.textContent).not.toContain('/fonts/bold-italic.woff2')
  })

  it('uses the bundled font unless a URL is supplied', () => {
    const { rerender } = render(<LtiPageSettings useDyslexicFont>Bundled font</LtiPageSettings>)
    expect(document.head.textContent).toContain(bundledFontUrl)
    expect(getComputedStyle(screen.getByText('Bundled font')).fontFamily)
      .toContain('LtiOpenDyslexic-')

    rerender(
      <LtiPageSettings useDyslexicFont fontUrl="/fonts/custom.woff2">Custom font</LtiPageSettings>
    )
    expect(document.head.textContent).toContain('/fonts/custom.woff2')
    expect(document.head.textContent).not.toContain(bundledFontUrl)

    rerender(<LtiPageSettings useDyslexicFont>Bundled again</LtiPageSettings>)
    expect(document.head.textContent).toContain(bundledFontUrl)
    expect(document.head.textContent).not.toContain('/fonts/custom.woff2')
  })

  it('registers the bundled fonts without applying them while disabled by default', () => {
    render(<LtiPageSettings>Unchanged</LtiPageSettings>)
    expect(screen.getByText('Unchanged')).toBeInTheDocument()
    expect(document.head.textContent).toContain(bundledFontUrl)
    expect(fontFaces()).toHaveLength(4)
    expect(document.querySelector('[data-lti-dyslexic-font]')).toBeNull()
  })

  it.each([undefined, false])('leaves fonts and the surrounding theme unchanged with enabled=%s', (enabled) => {
    render(
      <InstUISettingsProvider theme={canvasHighContrast}>
        <LtiPageSettings fontUrl="/fonts/disabled.woff2" useDyslexicFont={enabled}>
          <p style={{ fontFamily: 'serif' }}>Unchanged</p>
          <ThemeProbe />
        </LtiPageSettings>
      </InstUISettingsProvider>
    )

    expect(getComputedStyle(screen.getByText('Unchanged')).fontFamily).toBe('serif')
    expect(JSON.parse(screen.getByTestId('theme').textContent).typography)
      .toEqual(canvasHighContrast.typography)
    expect(document.head.textContent).toContain('/fonts/disabled.woff2')
    expect(document.querySelector('[data-lti-dyslexic-font]')).toBeNull()
  })

  it('toggles fonts without remounting children or losing their state', () => {
    const content = (enabled) => (
      <InstUISettingsProvider theme={canvasHighContrast}>
        <LtiPageSettings fontUrl="/fonts/toggle.woff2" useDyslexicFont={enabled}>
          <input aria-label="Name" defaultValue="Saved input" />
          <ThemeProbe />
        </LtiPageSettings>
      </InstUISettingsProvider>
    )
    const { rerender } = render(content(false))
    const input = screen.getByRole('textbox')
    const styles = document.querySelector('style[data-emotion*="-global"]')
    expect(fontFaces()).toHaveLength(4)
    input.value = 'Edited input'

    for (const enabled of [true, false, true]) {
      rerender(content(enabled))
      expect(fontFaces()).toHaveLength(4)
      expect(document.querySelector('style[data-emotion*="-global"]')).toBe(styles)
      expect(screen.getByRole('textbox')).toBe(input)
      expect(input).toHaveValue('Edited input')
      const typography = JSON.parse(screen.getByTestId('theme').textContent).typography
      if (enabled) {
        expect(getComputedStyle(input).fontFamily).toContain('LtiOpenDyslexic-')
        expect(typography.fontFamily).toContain('LtiOpenDyslexic-')
        expect(document.head.textContent).toContain('/fonts/toggle.woff2')
      } else {
        expect(getComputedStyle(input).fontFamily).not.toContain('LtiOpenDyslexic-')
        expect(typography).toEqual(canvasHighContrast.typography)
        expect(document.head.textContent).toContain('/fonts/toggle.woff2')
      }
    }
  })

  it('overrides descendant font families without styling content outside the wrapper', () => {
    render(
      <>
        <p style={{ fontFamily: 'serif' }}>Outside</p>
        <LtiPageSettings fontUrl="/fonts/OpenDyslexic-Regular.woff2" useDyslexicFont>
          <section>
            <p>Inside</p>
            <button>Continue</button>
            <input aria-label="Name" />
          </section>
        </LtiPageSettings>
      </>
    )

    for (const element of [
      screen.getByText('Inside'),
      screen.getByRole('button'),
      screen.getByRole('textbox')
    ]) {
      expect(getComputedStyle(element).fontFamily).toContain('LtiOpenDyslexic-')
    }
    expect(getComputedStyle(screen.getByText('Outside')).fontFamily).toBe('serif')
  })

  it('preserves the outer theme and applies typography to portaled Instructure components', () => {
    render(
      <InstUISettingsProvider theme={canvasHighContrast}>
        <LtiPageSettings fontUrl="/fonts/OpenDyslexic-Regular.woff2" useDyslexicFont>
          <ThemeProbe />
          <PortaledText />
        </LtiPageSettings>
      </InstUISettingsProvider>
    )

    const theme = JSON.parse(screen.getByTestId('theme').textContent)
    expect(theme.colors).toEqual(canvasHighContrast.colors)
    expect(theme.typography.fontSizeMedium).toBe(canvasHighContrast.typography.fontSizeMedium)
    expect(theme.typography.fontFamily).toContain('LtiOpenDyslexic-')
    expect(theme.typography.fontFamilyMonospace).toBe(theme.typography.fontFamily)
    expect(getComputedStyle(screen.getByText('Portaled text')).fontFamily)
      .toBe(theme.typography.fontFamily.replace(', ', ','))
  })

  it('updates and removes the supplied font source with the component', () => {
    const { rerender, unmount } = render(
      <LtiPageSettings fontUrl="/fonts/first.woff2" useDyslexicFont>Text</LtiPageSettings>
    )
    expect(document.head.textContent).toContain('/fonts/first.woff2')

    rerender(<LtiPageSettings fontUrl="/fonts/second.woff2" useDyslexicFont>Text</LtiPageSettings>)
    expect(document.head.textContent).toContain('/fonts/second.woff2')
    expect(document.head.textContent).not.toContain('/fonts/first.woff2')

    unmount()
    expect(document.head.textContent).not.toContain('/fonts/second.woff2')
  })

  it('keeps different font URLs isolated between instances', () => {
    render(
      <>
        <LtiPageSettings fontUrl="/fonts/first.woff2" useDyslexicFont><p>First</p></LtiPageSettings>
        <LtiPageSettings fontUrl="/fonts/second.woff2" useDyslexicFont><p>Second</p></LtiPageSettings>
      </>
    )

    expect(getComputedStyle(screen.getByText('First')).fontFamily)
      .not.toBe(getComputedStyle(screen.getByText('Second')).fontFamily)
    expect(document.head.textContent).toContain('/fonts/first.woff2')
    expect(document.head.textContent).toContain('/fonts/second.woff2')
  })
})
