
import { useEffect, useRef, useState } from 'react';
import { useCanvas } from './useCanvas';
import { ClearBox } from './ClearBox';
import axios from 'axios';
import CardProduk from '../CardProduk';
import Skeleton from '../Skeleton';
import DropzoneImage from '../Dropzone';


const SelectImageArea = () => {
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [dataImage, setDataImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const imageFile = file ? URL.createObjectURL(file) : null;
  const [animateClearBox, setAnimateClearBox] = useState(false);
 

  const {
    boxPosition,
    boxSize,
    setIsDragging,
    setIsResizing,
    setResizeHandle,
    croppedImageUrl,
    cropImage,
    setIsAnimate

  } = useCanvas(canvasRef, divRef, { x: 40, y: 40 }, { width: 300, height: 300 }, imageFile,);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleResizeStart = (handle) => (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);

  };







  const hadleCrop = () => {
    cropImage()
    const fetchImageData = async () => {
      const imageUrl = await croppedImageUrl
      setImageSrc(imageUrl);
      console.log('Cropping image with URL:', imageUrl);
      if (imageUrl) {
        console.log('Cropping image with URL:', imageUrl);
        try {
          const response = await fetch(imageUrl);
          const file = await response.blob();
          const formData = new FormData();
          formData.append('query_img', file, 'cropped_image.jpg');

          setLoading(true);
          const res = await axios.post('https://rjk80hjv-5000.asse.devtunnels.ms/', formData);
          console.log(res)
          console.log('API Response:', res.data);
          setDataImage(res.data.results);
          // setImageSrc(res.data.query_image);
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('imageUrl is empty, skipping API call.');
      }
    };
    fetchImageData()

  }

  useEffect(() => {
    if (file) {
      setAnimateClearBox(true)
      setIsAnimate(true)
    }

  }, [animateClearBox, setIsAnimate, file]);

  return (
    <div className="flex flex-col items-center">
      {!file ? (
        <DropzoneImage setFile={setFile} />
      ) : null}
      <div className="container bg-gray-800  p-24 justify-center flex flex-col space-y-12 items-center">
        <div className="border rounded-3xl p-2  w-64 ">
          <h1 className="text-white  text-center font-semibold">Cari sumber Produk</h1>
        </div>
        <div className="relative w-96 h-96">
          <div className="w-full h-full">

            <img src={imageFile} className="w-full h-full" alt="Your image"
            />

          </div>
          <div className="top-0 absolute  w-full h-full" ref={divRef}>
            <canvas ref={canvasRef} className="absolute"></canvas>
          </div>
          <ClearBox
            boxPosition={boxPosition}
            boxSize={boxSize}
            onDragStart={handleDragStart}
            onResizeStart={handleResizeStart}
            animateClearBox={animateClearBox}
          />
        </div>

      </div>
      <button className="w-24 h-12 bg-blue-600 hover:bg-blue-500 text-white" onClick={hadleCrop}>
        Search
      </button>

      {/* {imageSrc && (
        <div className="mt-4 border">
          <img src={imageSrc} alt="Cropped area" />
        </div>
      )} */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <Skeleton key={i} />)
        ) : (
          dataImage?.map((produk) => (
            <CardProduk produk={produk} key={produk.id} />
          ))
        )}

      </div>
    </div>
  );
};

export default SelectImageArea;



