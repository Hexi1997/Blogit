import { UploadTask } from 'prosekit/extensions/file'
import type { ImageAttrs } from 'prosekit/extensions/image'
import type { ReactNodeViewProps } from 'prosekit/react'
import { useEffect, useMemo, useState } from 'react'

export default function ImageView(props: ReactNodeViewProps) {
  const attrs = props.node.attrs as ImageAttrs
  const url = attrs.src || ''
  const uploadTask = useMemo(() => {
    if (!url) return undefined
    return UploadTask.get<string>(url)
  }, [url])
  const uploading = Boolean(uploadTask)

  const [error, setError] = useState<string | undefined>()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!uploading) return
    const task = uploadTask
    if (!task) return

    let canceled = false

    task.finished.catch((error) => {
      if (canceled) return
      setError(String(error))
    })
    const unsubscribeProgress = task.subscribeProgress(({ loaded, total }) => {
      if (canceled) return
      setProgress(total ? loaded / total : 0)
    })

    return () => {
      canceled = true
      unsubscribeProgress()
    }
  }, [uploadTask, uploading])

  return (
    <div
      data-selected={props.selected ? '' : undefined}
      className="relative flex items-center justify-center box-border overflow-hidden my-2 group max-h-[600px] w-full min-h-[64px] outline-2 outline-transparent data-selected:outline-blue-500 outline-solid"
    >
      {url && !error && (
        <img
          src={url}
          alt="upload preview"
          className="h-auto !w-full max-w-full object-contain rounded-[16px]"
          style={{ width: '100%' }}
        />
      )}
      {uploading && !error && (
        <div className="absolute bottom-0 left-0 m-1 flex content-center items-center gap-2 rounded-sm bg-gray-800/60 p-1.5 text-xs text-white/80 transition">
          <div className="i-lucide-loader-circle size-4 animate-spin block"></div>
          <div>{Math.round(progress * 100)}%</div>
        </div>
      )}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center gap-4 bg-gray-200 p-2 text-sm dark:bg-gray-800 @container">
          <div className="i-lucide-image-off size-8 block"></div>
          <div className="hidden opacity-80 @xs:block">
            Failed to upload image
          </div>
        </div>
      )}
    </div>
  )
}
