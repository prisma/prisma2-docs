import * as React from 'react'
import styled from 'styled-components'
import { Typescript } from '../icons/technologies/Typescript'
import SelectComponent from './select'
import PostgreSQL from '../icons/technologies/PostgreSQL'
import MySQL from '../icons/technologies/MySQL'
import SQLite from '../icons/technologies/SQLite'
import JS from '../icons/technologies/JS'
import { components } from 'react-select'
import ArrowDown from '../icons/ArrowDown'

interface TechSwitchProps {
  type: string
  onChangeTech: (item: any) => void
  technologies: string[]
  defaultTech: string
}

interface TechItem {
  technology: keyof typeof icons
}

const icons = {
  node: <JS />,
  typescript: <Typescript />,
  mysql: <MySQL />,
  postgres: <PostgreSQL />,
  sqlite: <SQLite />,
}

const technologyTypes = {
  languages: ['node', 'typescript'],
  databases: ['mysql', 'postgres', 'sqlite'],
}

export const technologyNames = {
  node: 'JavaScript',
  typescript: 'TypeScript',
  mysql: 'MySQL',
  postgres: 'PostgreSQL',
  sqlite: 'SQLite',
}

const TechnologySwitch = ({ type, onChangeTech, technologies, defaultTech }: TechSwitchProps) => {
  const langDefault = { technology: defaultTech || 'typescript' }
  const dbDefault = { technology: defaultTech || 'postgres' }
  const defaultItem = type === 'lang' ? langDefault : dbDefault

  const [selectedItem, setSelectedItem] = React.useState(defaultItem)

  const renderItem = (item: TechItem) => {
    return (
      <SelectItem>
        {icons[item.technology]}
        <span>{technologyNames[item.technology]}</span>
      </SelectItem>
    )
  }

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    )
  }

  const IndicatorSeparator = () => {
    return <span style={{ display: 'none' }} />
  }

  const Option = (props: any) => {
    return (
      <components.Option {...props}>{renderItem({ technology: props.value })}</components.Option>
    )
  }

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {renderItem({ technology: props.children })}
    </components.SingleValue>
  )

  const handleChange = (item: TechItem) => {
    setSelectedItem(item)
    onChangeTech(item)
  }

  let items =
    type === 'lang'
      ? technologyTypes.languages.map((lang: any) => ({ technology: lang }))
      : technologyTypes.databases.map((db: any) => ({ technology: db }))

  if (technologies) {
    items = items.filter((item: any) => technologies.includes(item.technology))
  }

  return (
    <Container>
      <SelectComponent
        items={items}
        DropdownIndicator={DropdownIndicator}
        IndicatorSeperator={IndicatorSeparator}
        Option={Option}
        SingleValue={SingleValue}
        selectedItem={selectedItem}
        onChange={handleChange}
        width={168}
      />
    </Container>
  )
}

const Container = styled.div`
  margin: 16px 1rem 0 0;
  width: 170px;

  @media only screen and (max-width: 767px) {
    margin: 8px 0 0;
    width: 100%;
  }
`

const SelectItem = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`

export default TechnologySwitch
