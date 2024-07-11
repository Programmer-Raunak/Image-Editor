import './image_editor.css'
import React, { useState, useRef } from 'react';
import imgPlaceholder from '../../public/image-placeholder.svg'


const ImageEditor = () => {
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  const [activeFilter, setActiveFilter] = useState('brightness');
  const [filterName, setFilterName] = useState('Brightness');
  const [filterValue, setFilterValue] = useState('100%');

  const previewImgRef = useRef();
  const fileInputRef = useRef();

  const loadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgURL = URL.createObjectURL(file);
    previewImgRef.current.src = imgURL;
    previewImgRef.current.addEventListener('load', () => {
      document.querySelector(".container").classList.remove("disable");
      resetFilter();
    });
  };

  const applyFilter = () => {
    const img = previewImgRef.current;
    img.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    img.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  };

  const handleFilterChange = (e) => {
    const filter = e.target.id;
    setActiveFilter(filter);
    setFilterName(e.target.innerText);
    switch (filter) {
      case 'brightness':
        setFilterValue(`${brightness}%`);
        break;
      case 'saturation':
        setFilterValue(`${saturation}%`);
        break;
      case 'inversion':
        setFilterValue(`${inversion}%`);
        break;
      case 'grayscale':
        setFilterValue(`${grayscale}%`);
        break;
      default:
        break;
    }
  };

  const updateFilter = (e) => {
    const value = e.target.value;
    setFilterValue(`${value}%`);
    switch (activeFilter) {
      case 'brightness':
        setBrightness(value);
        break;
      case 'saturation':
        setSaturation(value);
        break;
      case 'inversion':
        setInversion(value);
        break;
      case 'grayscale':
        setGrayscale(value);
        break;
      default:
        break;
    }
    applyFilter();
  };

  const handleRotate = (direction) => {
    setRotate((prev) => prev + (direction === 'left' ? -90 : 90));
    applyFilter();
  };

  const handleFlip = (axis) => {
    if (axis === 'horizontal') {
      setFlipHorizontal((prev) => (prev === 1 ? -1 : 1));
    } else {
      setFlipVertical((prev) => (prev === 1 ? -1 : 1));
    }
    applyFilter();
  };

  const resetFilter = () => {
    setBrightness(100);
    setSaturation(100);
    setInversion(0);
    setGrayscale(0);
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setActiveFilter('brightness');
    setFilterName('Brightness');
    setFilterValue('100%');
    applyFilter();
  };

  const saveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = previewImgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
      ctx.rotate((rotate * Math.PI) / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = 'image.jpg';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className='body'>
      <div className="container disable">
        <h2>Image Editor</h2>
        <div className="wrapper">
          <div className="editor-panel">
            <div className="filter">
              <label className="title">Filters</label>
              <div className="options">
                <button
                  id="brightness"
                  className={activeFilter === 'brightness' ? 'active' : ''}
                  onClick={handleFilterChange}
                >Brightness</button>
                <button
                  id="saturation"
                  className={activeFilter === 'saturation' ? 'active' : ''}
                  onClick={handleFilterChange}
                >Saturation</button>
                <button
                  id="inversion"
                  className={activeFilter === 'inversion' ? 'active' : ''}
                  onClick={handleFilterChange}
                >Inversion</button>
                <button
                  id="grayscale"
                  className={activeFilter === 'grayscale' ? 'active' : ''}
                  onClick={handleFilterChange}
                >Grayscale</button>
              </div>
              <div className="slider">
                <div className="filter-info">
                  <p className="name">{filterName}</p>
                  <p className="value">{filterValue}</p>
                </div>
                <input
                  type="range"
                  value={filterValue.replace('%', '')}
                  min="0"
                  max={activeFilter === 'brightness' || activeFilter === 'saturation' ? 200 : 100}
                  onInput={updateFilter}
                />
              </div>
            </div>
            <div className="rotate">
              <label className="title">Rotate & Flip</label>
              <div className="options">
                <button id="left" onClick={() => handleRotate('left')}><i className="fa-solid fa-rotate-left"></i></button>
                <button id="right" onClick={() => handleRotate('right')}><i className="fa-solid fa-rotate-right"></i></button>
                <button id="horizontal" onClick={() => handleFlip('horizontal')}><i className='bx bx-reflect-vertical'></i></button>
                <button id="vertical" onClick={() => handleFlip('vertical')}><i className='bx bx-reflect-horizontal'></i></button>
              </div>
            </div>
          </div>
          <div className="preview-img">
            <img src={imgPlaceholder} alt="preview-img" ref={previewImgRef} />
          </div>
        </div>
        <div className="controls">
          <button className="reset-filter" onClick={resetFilter}>Reset Filters</button>
          <div className="row">
            <input type="file" className="file-input" accept="image/*" ref={fileInputRef} onChange={loadImage} hidden />
            <button className="choose-img" onClick={() => fileInputRef.current.click()}>Choose Image</button>
            <button className="save-img" onClick={saveImage}>Export Image</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
