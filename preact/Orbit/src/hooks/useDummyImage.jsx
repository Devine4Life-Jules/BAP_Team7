import dummyImage1 from '../assets/dummyImage.png'
import dummyImage2 from '../assets/dummyImage2.png'
import dummyImage3 from '../assets/dummyImage3.png'
import dummyImage4 from '../assets/dummyImage4.png'
import dummyImage5 from '../assets/dummyImage5.png'
import dummyImage6 from '../assets/dummyImage6.png'

const DUMMY_IMAGES = [dummyImage1, dummyImage2, dummyImage3, dummyImage4, dummyImage5, dummyImage6]

export default function useDummyImage(projectId) {
  if (!projectId) {
    return DUMMY_IMAGES[Math.floor(Math.random() * DUMMY_IMAGES.length)]
  }
  return DUMMY_IMAGES[projectId % DUMMY_IMAGES.length]
}
