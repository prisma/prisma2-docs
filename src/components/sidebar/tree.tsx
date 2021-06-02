import * as React from 'react'
import TreeNode from './treeNode'
import { AllEdges } from '../../interfaces/AllArticles.interface'
import { createGlobalState } from 'react-hooks-global-state'
import { useLocation } from '@reach/router'
import { calculateTreeData } from '../../utils/treeData'

let defaultCollapsed: any = {}

const initialState = { collapsedState: defaultCollapsed }
const { useGlobalState } = createGlobalState(initialState)

const Tree = ({ edges }: AllEdges) => {
  const location = useLocation()
  let [treeData] = React.useState(() => {
    return calculateTreeData(edges, defaultCollapsed, location)
  })

  const [collapsed, setCollapsed] = useGlobalState('collapsedState')
  const toggle = (label: string, toggleContent: boolean, parents?: string[]) => {
    setCollapsed({
      ...collapsed,
      [label]: !toggleContent ? false : !collapsed[label],
    })
    if (parents) {
      parents.forEach(parent => {
        if (parent && collapsed[parent] !== null) {
          setCollapsed({
            ...collapsed,
            [parent]: false,
          })
        }
      })
    }
  }
  return <TreeNode setCollapsed={toggle} collapsed={collapsed} {...treeData} />
}

export default Tree
