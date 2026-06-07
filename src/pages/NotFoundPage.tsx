import { notFound } from '../appData'
import {
  Wrapper,
  Card,
  Code,
  Heading,
  Message,
  HomeLink,
} from './NotFoundPage.styles'

// A perforated pickleball, used as the middle "0" of 404. Holes are warm
// caramel at low opacity so they read as a real pickleball on the sunshine ball.
const Pickleball = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="var(--pf-sunshine)"
      stroke="var(--pf-caramel)"
      strokeWidth="3"
    />
    <g fill="var(--pf-caramel)" fillOpacity="0.4">
      <circle cx="50" cy="26" r="5" />
      <circle cx="32" cy="40" r="5" />
      <circle cx="68" cy="40" r="5" />
      <circle cx="24" cy="60" r="5" />
      <circle cx="50" cy="56" r="5" />
      <circle cx="76" cy="60" r="5" />
      <circle cx="40" cy="76" r="5" />
      <circle cx="62" cy="76" r="5" />
    </g>
  </svg>
)

const NotFoundPage = () => {
  return (
    <Wrapper role="main">
      <Card>
        <Code aria-label={notFound.code}>
          <span aria-hidden="true">4</span>
          <Pickleball />
          <span aria-hidden="true">4</span>
        </Code>
        <Heading>{notFound.heading}</Heading>
        <Message>{notFound.message}</Message>
        <HomeLink to="/">{notFound.homeLink}</HomeLink>
      </Card>
    </Wrapper>
  )
}

export default NotFoundPage
