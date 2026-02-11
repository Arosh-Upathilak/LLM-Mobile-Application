type onBoardingSlidesTypes = {
  color: string;
  image: any;
  title: string;
  secondTitle: string;
  subTitle: string;
};

type SlideProps = {
  slide: onBoardingSlidesTypes;
  index: number;
  setIndex: (value: number) => void;
  totalSlides: number;
};

interface SliderProps {
  index: number;
  setIndex: (value: number) => void;
  children: JSX.Element;
  prev?: JSX.Element;
  next?: JSX.Element;
}


interface WaveProps {
  side: Side;
  color: string;
  children: React.ReactElement;
  position: Vector<SharedValue<number>>;
  isTransitioning: SharedValue<boolean>;
}