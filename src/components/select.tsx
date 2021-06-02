import * as React from 'react'
import styled from 'styled-components'
import Select, { components } from 'react-select'

interface SelectProps {
  items: any[]
  onChange: (item: any) => void
  selectedItem: any
  width?: number
  DropdownIndicator: any
  IndicatorSeperator: any
  Option: any
  SingleValue: any
}

const SelectComponent = (props: SelectProps) => {
  const {
    selectedItem,
    onChange,
    items,
    DropdownIndicator,
    IndicatorSeperator,
    Option,
    SingleValue,
  } = props
  const width = props.width || 160

  const handleChange = (newValue: any) => {
    onChange({ technology: newValue.value })
  }

  const options = items.map(it => ({ value: it.technology, label: it.technology }))

  const selectedOption = options.filter(ff => ff.value === selectedItem.technology)

  const SelectContainer = (props: any) => {
    return (
      <components.SelectContainer {...props} className="select-container">
        {props.children}
      </components.SelectContainer>
    )
  }
  return (
    <SelectComponentWrapper>
      <Select
        width={width}
        options={options}
        defaultValue={selectedOption}
        onChange={handleChange}
        components={{ DropdownIndicator, IndicatorSeperator, Option, SingleValue, SelectContainer }}
      />
    </SelectComponentWrapper>
  )
}

export default SelectComponent

const SelectComponentWrapper = styled.div`
  .select-container {
    > div:first-child {
      height: 38px;
      border-color: #e2e8f0;
      border-radius: 5px;
    }
  }
` as any
