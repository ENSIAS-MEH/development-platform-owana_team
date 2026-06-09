import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Video from 'yet-another-react-lightbox/plugins/video';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import ReactLightbox, { useLightboxState } from 'yet-another-react-lightbox';
import {
  faPlay,
  faTimes,
  faPause,
  faExpand,
  faCompress,
  faSearchPlus,
  faSearchMinus,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';

import { lightboxClasses } from './classes';

import type { LightBoxProps } from './types';

// ----------------------------------------------------------------------

export function Lightbox({
  slides,
  disableZoom,
  disableVideo,
  disableTotal,
  disableCaptions,
  disableSlideshow,
  disableThumbnails,
  disableFullscreen,
  onGetCurrentIndex,
  ...other
}: LightBoxProps) {
  const totalItems = slides ? slides.length : 0;

  return (
    <ReactLightbox
      slides={slides}
      animation={{ swipe: 240 }}
      carousel={{ finite: totalItems < 5 }}
      controller={{ closeOnBackdropClick: true }}
      plugins={getPlugins({
        disableZoom,
        disableVideo,
        disableCaptions,
        disableSlideshow,
        disableThumbnails,
        disableFullscreen,
      })}
      on={{
        view: ({ index }: { index: number }) => {
          if (onGetCurrentIndex) {
            onGetCurrentIndex(index);
          }
        },
      }}
      toolbar={{
        buttons: [
          <DisplayTotal key={0} totalItems={totalItems} disableTotal={disableTotal} />,
          'close',
        ],
      }}
      render={{
        iconClose: () => <FontAwesomeIcon icon={faTimes} size="lg" />,
        iconZoomIn: () => <FontAwesomeIcon icon={faSearchPlus} size="lg" />,
        iconZoomOut: () => <FontAwesomeIcon icon={faSearchMinus} size="lg" />,
        iconSlideshowPlay: () => <FontAwesomeIcon icon={faPlay} size="lg" />,
        iconSlideshowPause: () => <FontAwesomeIcon icon={faPause} size="lg" />,
        iconPrev: () => <FontAwesomeIcon icon={faChevronLeft} size="2x" />,
        iconNext: () => <FontAwesomeIcon icon={faChevronRight} size="2x" />,
        iconExitFullscreen: () => <FontAwesomeIcon icon={faCompress} size="lg" />,
        iconEnterFullscreen: () => <FontAwesomeIcon icon={faExpand} size="lg" />,
      }}
      className={lightboxClasses.root}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

export function getPlugins({
  disableZoom,
  disableVideo,
  disableCaptions,
  disableSlideshow,
  disableThumbnails,
  disableFullscreen,
}: Partial<LightBoxProps>) {
  let plugins = [Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom];

  if (disableThumbnails) {
    plugins = plugins.filter((plugin) => plugin !== Thumbnails);
  }
  if (disableCaptions) {
    plugins = plugins.filter((plugin) => plugin !== Captions);
  }
  if (disableFullscreen) {
    plugins = plugins.filter((plugin) => plugin !== Fullscreen);
  }
  if (disableSlideshow) {
    plugins = plugins.filter((plugin) => plugin !== Slideshow);
  }
  if (disableZoom) {
    plugins = plugins.filter((plugin) => plugin !== Zoom);
  }
  if (disableVideo) {
    plugins = plugins.filter((plugin) => plugin !== Video);
  }

  return plugins;
}

// ----------------------------------------------------------------------

type DisplayTotalProps = {
  totalItems: number;
  disableTotal?: boolean;
};

export function DisplayTotal({ totalItems, disableTotal }: DisplayTotalProps) {
  const { currentIndex } = useLightboxState();

  if (disableTotal) {
    return null;
  }

  return (
    <Box
      component="span"
      className="yarl__button"
      sx={{
        typography: 'body2',
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
      }}
    >
      <strong> {currentIndex + 1} </strong> / {totalItems}
    </Box>
  );
}
