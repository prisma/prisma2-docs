import * as React from 'react'
import styled from 'styled-components'
import TechnologySwitch from './techSwitcher'
import { urlGenerator } from '../utils/urlGenerator'
import { withPrefix } from 'gatsby'

const SwitcherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 767px) {
    width: 100%;
  }
`

const SwitcherBlock = ({ langSwitcher, dbSwitcher, location, navigate, slug }: any) => {
  const currentPath = location.pathname.replace(/\/$/, '')
  let [pathTechParams] = currentPath.split('/').splice(-1)

  const isTechPath = currentPath !== withPrefix(urlGenerator(slug))
  const getTechFromParam = (type: string, defaultVal: string) => {
    let tech = defaultVal

    if (isTechPath) {
      if (type === 'lang') {
        ;[tech] = pathTechParams.split('-').splice(dbSwitcher ? -2 : -1)
      }

      if (type === 'db') {
        ;[tech] = pathTechParams.split('-').splice(-1)
      }
    }
    return tech
  }

  const [langSelected, setLangSelected] = React.useState(
    langSwitcher ? getTechFromParam('lang', langSwitcher[0]) : 'typescript'
  )
  const [dbSelected, setDbSelected] = React.useState(
    dbSwitcher ? getTechFromParam('db', dbSwitcher[0]) : 'postgres'
  )

  const goToNewPath = () => {
    let newParams = `${langSwitcher ? `${langSelected}${dbSwitcher ? '-' : ''}` : ''}${
      dbSwitcher ? `${dbSelected}` : ''
    }`

    if (langSwitcher && !dbSwitcher) {
      // for paths without tech or lang in the url - to redirect to one with default tech and lang
      if (!langSwitcher.includes(pathTechParams.split('-').slice(-1)[0])) {
        pathTechParams = `${pathTechParams}-${langSwitcher[0]}`
      }
    } else if (!langSwitcher && dbSwitcher) {
      // for paths without tech or lang in the url - to redirect to one with default tech and lang
      if (!dbSwitcher.includes(pathTechParams.split('-').slice(-1)[0])) {
        pathTechParams = `${pathTechParams}-${dbSwitcher[0]}`
      }
    } else if (langSwitcher && dbSwitcher) {
      // for paths without tech or lang in the url - to redirect to one with default tech and lang
      if (!dbSwitcher.includes(pathTechParams.split('-').slice(-1)[0])) {
        pathTechParams = `${pathTechParams}-${langSwitcher[0]}-${dbSwitcher[0]}`
      }
    }

    if (!pathTechParams.includes(newParams)) {
      navigate(withPrefix(`${urlGenerator(slug)}-${newParams}${location.hash}`), {
        replace: location.pathname === urlGenerator(slug),
      })
    }
  }

  // TODO : Simplify the function!
  const techChanged = (item: any, type: string) => {
    const elements = document.querySelectorAll('[id^="techswitch"]')
    elements.forEach((element: any) => element.classList.remove('show'))
    const elemToShow = [].slice.call(elements).filter((elm: any) => {
      if (type === 'lang') {
        if (dbSwitcher) {
          if (elm.id.includes('-*-')) {
            // lang is any
            return elm.id.includes(`-${dbSelected}`)
          } else {
            return (
              elm.id.includes(`-${item.technology}`) &&
              (elm.id.includes(`-${dbSelected}`) || elm.id.includes(`-*`))
            )
          }
        } else {
          return elm.id.includes(`-${item.technology}`)
        }
      } else if (type === 'db') {
        if (langSwitcher) {
          if (elm.id.slice(-1) === '*') {
            // db is any
            return elm.id.includes(`-${langSelected}`)
          } else {
            return (
              elm.id.includes(`-${item.technology}`) &&
              (elm.id.includes(`-${langSelected}`) || elm.id.includes(`-*`))
            )
          }
        } else {
          return elm.id.includes(`-${item.technology}`)
        }
      }
    })
    elemToShow && elemToShow.forEach((eShow: any) => eShow.classList.add('show'))
    goToNewPath()
  }

  const langChanged = (item: any) => {
    techChanged(item, 'lang')
    setLangSelected(item.technology)
  }

  const dbChanged = (item: any) => {
    techChanged(item, 'db')
    setDbSelected(item.technology)
  }

  React.useEffect(() => {
    let mounted = true

    if (langSwitcher && !dbSwitcher && mounted) {
      langChanged({ technology: langSelected })
    } else if (dbSwitcher && !langSwitcher && mounted) {
      dbChanged({ technology: dbSelected })
    } else if (dbSwitcher && langSwitcher && mounted) {
      langChanged({ technology: langSelected })
      dbChanged({ technology: dbSelected })
    }

    return function cleanup() {
      mounted = false
    }
  }, [langSelected, dbSelected])
  return (
    <SwitcherWrapper>
      {langSwitcher && (
        <TechnologySwitch
          type="lang"
          onChangeTech={langChanged}
          technologies={langSwitcher}
          defaultTech={langSelected}
        />
      )}
      {dbSwitcher && (
        <TechnologySwitch
          type="db"
          onChangeTech={dbChanged}
          technologies={dbSwitcher}
          defaultTech={dbSelected}
        />
      )}
    </SwitcherWrapper>
  )
}

export default SwitcherBlock
