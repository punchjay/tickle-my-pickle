import { Wrapper, Code, Message, HomeLink } from './NotFoundPage.styles'

export default function NotFoundPage() {
  return (
    <Wrapper role="main">
      <Code>404</Code>
      <h1>Page not found</h1>
      <Message>That page dinked out of bounds.</Message>
      <HomeLink to="/">Back to the courts</HomeLink>
    </Wrapper>
  )
}
