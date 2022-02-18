import React, {useCallback, useMemo, useState} from 'react'
import {useModuleStatus} from '@sanity/base/hooks'
import {PackageIcon} from '@sanity/icons'
import {DialogProps, useGlobalKeyDown} from '@sanity/ui'
import {ChangelogDialog, UpgradeAccordion} from '../../update'
import {StatusButton} from '../components'

export function ChangelogContainer() {
  const [open, setOpen] = useState<boolean>(false)
  const {value, error, isLoading} = useModuleStatus()
  const {changelog, currentVersion, latestVersion} = value || {}

  /**
   * We want to filter out the changes that have an empty `changeItems` array.
   * This is because, if `changeItems` array is empty, there is no information
   * to display for that change in the `ChangelogDialog`
   */
  const changesWithChangeItems = changelog?.filter((c) => c.changeItems?.length > 0)
  const hasChangesToDisplay = changesWithChangeItems?.length > 0

  const handleToggleOpen = useCallback(() => setOpen((v) => !v), [])

  useGlobalKeyDown(
    useCallback(
      (e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false)
        }
      },
      [open]
    )
  )

  const dialogProps: Omit<DialogProps, 'id'> = useMemo(
    () => ({
      footer: <UpgradeAccordion />,
      onClickOutside: handleToggleOpen,
      onClose: handleToggleOpen,
      scheme: 'light',
    }),
    [handleToggleOpen]
  )

  if (error || isLoading || !changelog || !hasChangesToDisplay) {
    return null
  }

  return (
    <>
      <StatusButton
        icon={PackageIcon}
        mode="bleed"
        onClick={handleToggleOpen}
        selected={open}
        statusTone="primary"
      />
      {open && (
        <ChangelogDialog
          dialogProps={dialogProps}
          changelog={changesWithChangeItems}
          currentVersion={currentVersion}
          latestVersion={latestVersion}
        />
      )}
    </>
  )
}
