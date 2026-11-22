'use client';

import { faCircleInfo, faCheckCircle, faCircleExclamation, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import Portal from '@mui/material/Portal';

import { StyledToaster } from './styles';
import {FontAwesome} from '../fontawesome';
import { toasterClasses } from './classes';

// ----------------------------------------------------------------------

export function Snackbar() {
  return (
    <Portal>
      <StyledToaster
        expand
        gap={12}
        closeButton
        offset={16}
        visibleToasts={4}
        position="top-right"
        className={toasterClasses.root}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: toasterClasses.toast,
            icon: toasterClasses.icon,
            // content
            content: toasterClasses.content,
            title: toasterClasses.title,
            description: toasterClasses.description,
            // button
            actionButton: toasterClasses.actionButton,
            cancelButton: toasterClasses.cancelButton,
            closeButton: toasterClasses.closeButton,
            // state
            default: toasterClasses.default,
            info: toasterClasses.info,
            error: toasterClasses.error,
            success: toasterClasses.success,
            warning: toasterClasses.warning,
          },
        }}
        icons={{
          loading: <span className={toasterClasses.loadingIcon} />,
          info:  <FontAwesome icon={faCircleInfo} className={toasterClasses.iconSvg} />,
          success:  <FontAwesome icon={faCheckCircle} className={toasterClasses.iconSvg} />,
          warning: <FontAwesome icon={faTriangleExclamation} className={toasterClasses.iconSvg} />,
          error:  <FontAwesome icon={faCircleExclamation} className={toasterClasses.iconSvg} />,
        }}
      />
    </Portal>
  );
}

