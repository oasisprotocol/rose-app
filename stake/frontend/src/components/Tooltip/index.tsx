import {
  cloneElement,
  createContext,
  FC,
  forwardRef,
  isValidElement,
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingArrow,
  arrow,
  computePosition,
} from '@floating-ui/react'
import type { Placement } from '@floating-ui/react'
import { StringUtils } from '../../utils/string.utils'
import classes from './index.module.css'

interface TooltipOptions {
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  floatingArrowRef?: MutableRefObject<SVGSVGElement | null>
}

const useTooltip = ({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  floatingArrowRef,
}: TooltipOptions = {}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const middleware = [
    offset(14),
    flip({
      crossAxis: placement.includes('-'),
      fallbackAxisSideDirection: 'start',
    }),
    arrow({
      element: floatingArrowRef as unknown as Element,
    }),
  ]

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: (reference, floating) =>
      autoUpdate(
        reference,
        floating,
        () =>
          computePosition(reference, floating, { placement, middleware, strategy: 'absolute' }).then(
            ({ x, y }) => {
              Object.assign(floating.style, {
                left: `${x}px`,
                top: `${y}px`,
              })
            }
          ),
        {}
      ),
    middleware,
  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  })
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const interactions = useInteractions([hover, focus, dismiss, role])

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  )
}

type ContextType = ReturnType<typeof useTooltip> | null

const TooltipContext = createContext<ContextType>(null)

const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }

  return context
}

export const Tooltip: FC<PropsWithChildren<Omit<TooltipOptions, 'floatingArrowRef'>>> = ({
  children,
  ...options
}) => {
  const floatingArrowRef = useRef<SVGSVGElement | null>(null)
  const tooltip = useTooltip({ ...options, floatingArrowRef })

  return (
    <>
      <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>

      <div ref={tooltip.refs.setFloating} style={tooltip.floatingStyles}>
        <FloatingArrow
          ref={floatingArrowRef}
          context={tooltip.context}
          style={{ visibility: tooltip?.context.open ? 'visible' : 'hidden', left: '-7px' }}
        />
      </div>
    </>
  )
}

export const TooltipTrigger = forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = useTooltipContext()
    const childrenRef = (children as unknown as { ref: RefObject<object> }).ref
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        })
      )
    }

    return (
      <button
        ref={ref}
        className={classes.tooltipTrigger}
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
      >
        {children}
      </button>
    )
  }
)

export const TooltipContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ style, className, ...props }, propRef) => {
    const context = useTooltipContext()
    const ref = useMergeRefs([context.refs.setFloating, propRef])

    if (!context.open) return null

    return (
      <FloatingPortal>
        <div
          ref={ref}
          className={StringUtils.clsx(classes.tooltipContent, className)}
          style={{
            ...context.floatingStyles,
            ...style,
          }}
          {...context.getFloatingProps(props)}
        />
      </FloatingPortal>
    )
  }
)
