import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import { app, footer } from '@/appData'

describe('Footer', () => {
  it('shows the wordmark and the current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === 'FOOTER' &&
          el.textContent?.includes(`© ${year} ${app.wordmark}`) === true,
      ),
    ).toBeInTheDocument()
  })

  it('links the contact message via mailto', () => {
    render(<Footer />)
    const contact = screen.getByRole('link', { name: footer.contactLabel })
    expect(contact).toHaveAttribute(
      'href',
      `mailto:${footer.email}?subject=Hello!`,
    )
  })

  it('links the GitHub profile in a new tab', () => {
    render(<Footer />)
    const gh = screen.getByRole('link', { name: footer.githubLabel })
    expect(gh).toHaveAttribute('href', footer.githubUrl)
    expect(gh).toHaveAttribute('target', '_blank')
    expect(gh).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
