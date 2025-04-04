import { useEffect, useRef, useState } from 'react'
import { mapData } from '../../api/map-data'
import { Base } from '../Base'
import { PageNotFound } from '../PageNotFound'
import { Loading } from '../Loading'
import { GridTwoColumns } from '../../components/GridTwoColumns'
import { GridContent } from '../../components/GridContent'
import { GridText } from '../../components/GridText'
import { GridImage } from '../../components/GridImage'
import { useLocation } from 'react-router-dom'

function Home() {
  const [data, setData] = useState(null)
  const isMounted = useRef(true)
  const location = useLocation()

  useEffect(() => {
    const pathName = location.pathname.replace(/[^a-z0-9-_]/gi, '')
    const slug = pathName ? pathName : 'landing-page'
    console.log(slug)

    const load = async () => {
      try {
        const resposta = await fetch(
          // `http://localhost:1337/api/pages/?filters[slug]=${slug}&populate[menu][populate]=*&populate[sections][populate]=*`

          `https://criar-landing-page.onrender.com/api/pages/?filters[slug]=${slug}&populate[menu][populate]=*&populate[sections][populate]=*`
        )
        const json = await resposta.json()

        // console.log('JSON recebido da API:', json)

        if (!json.data || json.data.length === 0) {
          throw new Error('Página não encontrada')
        }

        // Agora passamos o próprio objeto data[0] para mapData
        const mappedData = mapData([json.data[0]])
        // console.log('Dados após mapData:', mappedData)

        if (!mappedData || mappedData.length === 0 || !mappedData[0].slug) {
          throw new Error('Slug não encontrado após mapData')
        }

        setData(mappedData[0])
      } catch (error) {
        console.error(error)
        setData(undefined)
      }
    }

    if (isMounted.current) {
      load()
    }

    return () => {
      isMounted.current = false
    }
  }, [location])

  // Alterando o título da página com base nos dados recebidos
  useEffect(() => {
    if (data === undefined) {
      document.title = 'Página não encontrada'
    }

    if (!data) {
      document.title = 'Carregando...'
    }

    if (data && data.title) {
      document.title = data.title
    }
  }, [data])

  if (data === undefined) {
    return <PageNotFound />
  }

  if (!data) {
    return <Loading />
  }

  const { menu, sections, footerHtml, slug } = data
  const { links, text, link, srcImg } = menu
  // console.log(menu)

  // console.log({ text, link, srcImg })

  return (
    <Base
      links={links}
      footerHtml={footerHtml}
      logoData={{ text, link, srcImg }}
    >
      {sections.map((section, index) => {
        const { component } = section
        // console.log(component)

        const key = `${slug}-${index}`

        if (component === 'section.section-two-columns') {
          return <GridTwoColumns key={key} {...section} />
        }

        if (component === 'section.section-content') {
          return <GridContent key={key} {...section} />
        }

        if (component === 'section.section-grid-text') {
          return <GridText key={key} {...section} />
        }

        if (component === 'section.section-grid-gallery') {
          return <GridImage key={key} {...section} />
        }
      })}
    </Base>
  )
}

export default Home
