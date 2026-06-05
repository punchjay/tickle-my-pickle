import { notFound } from '../appData'
import { Wrapper, Code, Message, HomeLink } from './NotFoundPage.styles'

const NotFoundPage = () => {
  return (
    <Wrapper role="main">
      <Code>{notFound.code}</Code>
      <h1>{notFound.heading}</h1>
      <Message>{notFound.message}</Message>
      <HomeLink to="/">{notFound.homeLink}</HomeLink>
    </Wrapper>
  )
}

export default NotFoundPage
