// @todo: remove the following line when part imports has been removed from this file
///<reference types="@sanity/types/parts" />

import {MenuItem as MenuItemType} from '@sanity/base/__legacy/@sanity/components'
import {ArrowLeftIcon, CloseIcon, SplitVerticalIcon} from '@sanity/icons'
import {Button, Inline} from '@sanity/ui'
import {negate} from 'lodash'
import LanguageFilter from 'part:@sanity/desk-tool/language-select-component?'
import React, {forwardRef, useMemo} from 'react'
import {PaneHeader, PaneContextMenuButton} from '../../../../components/pane'
import {useDeskTool} from '../../../../contexts/deskTool'
import {BackLink, usePaneRouter} from '../../../../contexts/paneRouter'
import {useDocumentHistory} from '../../documentHistory'
import {TimelineMenu} from '../../timeline'
import {useDocumentPane} from '../../useDocumentPane'
import {DocumentHeaderTabs} from './DocumentHeaderTabs'
import {ValidationMenu} from './ValidationMenu'

export interface DocumentPanelHeaderProps {
  rootElement: HTMLDivElement | null
  title: React.ReactNode
}

const isActionButton = (item: MenuItemType) => Boolean(item.showAsAction)
const isMenuButton = negate(isActionButton)

export const DocumentPanelHeader = forwardRef(function DocumentPanelHeader(
  props: DocumentPanelHeaderProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {rootElement, title} = props
  const {
    closable,
    documentSchema,
    handleMenuAction,
    handlePaneClose,
    handlePaneSplit,
    markers,
    menuItems,
    menuItemGroups,
    views,
  } = useDocumentPane()
  const {historyController} = useDocumentHistory()
  const {revTime: rev} = historyController
  const {features} = useDeskTool()
  const {index} = usePaneRouter()
  const contextMenuItems = useMemo(() => menuItems.filter(isMenuButton), [menuItems])
  const [isValidationOpen, setValidationOpen] = React.useState<boolean>(false)
  const showTabs = views.length > 1
  const showVersionMenu = features.reviewChanges || views.length === 1

  const languageMenu = LanguageFilter && (
    <LanguageFilter key="language-menu" schemaType={documentSchema} />
  )

  const validationMenu = useMemo(
    () =>
      markers.length > 0 && (
        <ValidationMenu
          boundaryElement={rootElement}
          isOpen={isValidationOpen}
          key="validation-menu"
          setOpen={setValidationOpen}
        />
      ),
    [isValidationOpen, markers, rootElement]
  )

  const contextMenu = useMemo(
    () => (
      <PaneContextMenuButton
        itemGroups={menuItemGroups}
        items={contextMenuItems}
        key="context-menu"
        onAction={handleMenuAction}
      />
    ),
    [contextMenuItems, handleMenuAction, menuItemGroups]
  )

  const splitPaneButton = useMemo(() => {
    if (!features.splitViews || !handlePaneSplit || views.length <= 1) {
      return null
    }

    return (
      <Button
        icon={SplitVerticalIcon}
        key="split-pane-button"
        mode="bleed"
        onClick={handlePaneSplit}
        title="Split pane right"
      />
    )
  }, [features.splitViews, handlePaneSplit, views.length])

  const closeViewButton = useMemo(() => {
    if (!features.splitViews || !handlePaneSplit || !closable) {
      return null
    }

    return (
      <Button
        icon={CloseIcon}
        key="close-view-button"
        mode="bleed"
        onClick={handlePaneClose}
        title="Close pane"
      />
    )
  }, [closable, features.splitViews, handlePaneClose, handlePaneSplit])

  const tabs = useMemo(() => showTabs && <DocumentHeaderTabs />, [showTabs])

  return (
    <PaneHeader
      actions={
        <Inline space={1}>
          {languageMenu}
          {validationMenu}
          {contextMenu}
          {splitPaneButton}
          {closeViewButton}
        </Inline>
      }
      backButton={
        features.backButton &&
        index > 0 && <Button as={BackLink} data-as="a" icon={ArrowLeftIcon} mode="bleed" />
      }
      ref={ref}
      subActions={showVersionMenu && <TimelineMenu chunk={rev} mode="rev" />}
      tabs={tabs}
      title={title}
    />
  )
})
