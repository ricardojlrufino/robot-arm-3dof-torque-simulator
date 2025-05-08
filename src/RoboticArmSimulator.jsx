import React, { useState, useEffect, useRef } from 'react';
import { calculateCoordinates, calculateTorques } from './utils/roboticArmMath';
import { renderRoboticArm } from './components/renderArm';

const RoboticArmSimulator = () => {
  const [params, setParams] = useState({
    lengths: { L1: 25, L2: 25, L3: 10 },
    angles: { L1: 45, L2: 0, L3: -45 },
    masses: { M2: 1, M3: 0.5, LOAD: 0.5 }
  });

  const [torques, setTorques] = useState({
    M1: { Nm: 0, kgfcm: 0 },
    M2: { Nm: 0, kgfcm: 0 },
    M3: { Nm: 0, kgfcm: 0 }
  });

  const [coordinates, setCoordinates] = useState({
    M1: { x: 0, y: 0 },
    M2: { x: 0, y: 0 },
    M3: { x: 0, y: 0 },
    LOAD: { x: 0, y: 0 }
  });

  const [zoom, setZoom] = useState(1);
  const [maxTorques, setMaxTorques] = useState({
    M1: 0, M2: 0, M3: 0
  });

  const svgRef = useRef(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0
  });

  const linkColors = {
    L1: "#FF5722",
    L2: "#2196F3",
    L3: "#9C27B0"
  };

  const colors = {
    base: "#4CAF50",
    joint: "#212121",
    load: "#FFC107",
    grid: "#EEEEEE"
  };

  const updateParam = (category, name, value) => {
    setParams(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: parseFloat(value)
      }
    }));
  };

  useEffect(() => {
    const newCoordinates = calculateCoordinates(params.lengths, params.angles);
    const newTorques = calculateTorques(newCoordinates, params.masses, params.lengths);
    
    setCoordinates(newCoordinates);
    setTorques(newTorques);
    
    setMaxTorques(prev => ({
      M1: Math.max(prev.M1, parseFloat(newTorques.M1.Nm)),
      M2: Math.max(prev.M2, parseFloat(newTorques.M2.Nm)),
      M3: Math.max(prev.M3, parseFloat(newTorques.M3.Nm))
    }));
  }, [params]);

  const getTorqueColor = (torqueNm, jointName) => {
    if (maxTorques[jointName] === 0) return "#4CAF50";
    const ratio = parseFloat(torqueNm) / maxTorques[jointName];
    const r = Math.min(255, Math.floor(255 * ratio));
    const g = Math.min(255, Math.floor(255 * (1 - ratio)));
    return `rgb(${r}, ${g}, 0)`;
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => {
    setZoom(1);
    setDragState(prev => ({ ...prev, translateX: 0, translateY: 0 }));
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setDragState({
      ...dragState,
      isDragging: true,
      startX: e.clientX - dragState.translateX,
      startY: e.clientY - dragState.translateY
    });
  };

  const handleMouseMove = (e) => {
    if (!dragState.isDragging) return;
    setDragState({
      ...dragState,
      translateX: e.clientX - dragState.startX,
      translateY: e.clientY - dragState.startY
    });
  };

  const handleMouseUp = () => {
    setDragState({ ...dragState, isDragging: false });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, dragState.startX, dragState.startY]);

  const svgWidth = 500;
  const svgHeight = 220;
  const scale = 5 * zoom;
  const centerX = svgWidth / 2 - 100;
  const centerY = svgHeight / 2 + 50;

  const renderConfig = {
    svgWidth,
    svgHeight,
    scale,
    centerX,
    centerY,
    coordinates,
    torques,
    colors,
    linkColors,
    dragState,
    handleMouseDown,
    getTorqueColor,
    maxTorques,
    zoom
  };

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 bg-gray-50 rounded-lg shadow-md max-w-[1400px] mx-auto">

      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="w-full lg:w-64 bg-white p-3 sm:p-4 rounded-lg shadow lg:mr-4 flex-shrink-0 order-2 lg:order-1">
          <h3 className="text-lg font-semibold mb-4 select-none">Parâmetros</h3>
          
          <div className="mb-4 sm:mb-6">
            <h4 className="font-medium mb-2">Ângulos (graus)</h4>
            {Object.entries(params.angles).map(([key, value]) => (
              <div key={key} className="mb-2 flex items-center">
                <label className="text-sm w-10" style={{ color: linkColors[key] }}>{key}:</label>
                
                <input 
                  type="range" 
                  min="-90" 
                  max="90" 
                  value={value} 
                  onChange={(e) => updateParam('angles', key, e.target.value)}
                  className="w-full cursor-move"
                  style={{ accentColor: linkColors[key] }}
                />

                <div className="flex justify-between pl-5">
                  
                  <span className="w-5 text-sm font-medium" style={{ color: linkColors[key] }}>{value}°</span>
                 
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-4 sm:mb-6">
            <h4 className="font-medium mb-2">Comprimentos (cm)</h4>
            {Object.entries(params.lengths).map(([key, value]) => (
              <div key={key} className="mb-2 flex items-center">
                <label className="text-sm w-10" style={{ color: linkColors[key] }}>{key}:</label>
                <input 
                  type="number" 
                  min={key === 'L3' ? 1 : 5} 
                  max={key === 'L3' ? 30 : 50} 
                  step="0.1"
                  value={value} 
                  onChange={(e) => updateParam('lengths', key, e.target.value)}
                  className="w-full p-1 border rounded text-xs"
                  style={{ borderColor: linkColors[key] }}
                />
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Massas (kg)</h4>
            {Object.entries(params.masses).map(([key, value]) => (
              <div key={key} className="mb-2 flex items-center">
                <label className="text-sm w-10">{key}:</label>
                <input 
                  type="number" 
                  min="0.1" 
                  max="5" 
                  step="0.1"
                  value={value} 
                  onChange={(e) => updateParam('masses', key, e.target.value)}
                  className="w-full p-1 border rounded text-xs"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-2 border rounded bg-gray-50">
            <h4 className="font-medium mb-1 text-sm">Legenda:</h4>
            {Object.entries(linkColors).map(([key, color]) => (
              <div key={key} className="flex items-center mb-1">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: color }}></div>
                <span className="text-xs">Link {key.slice(1)}</span>
              </div>
            ))}
            <div className="mt-2">
              <div className="flex items-center">
                <div className="w-full h-4 bg-gradient-to-r from-green-500 to-red-500 rounded"></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs">Torque Min</span>
                <span className="text-xs">Torque Max</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 order-1 lg:order-2">
          <div className="bg-white p-2 sm:p-4 rounded-lg shadow relative">
            <div className="absolute top-2 right-2 bg-white bg-opacity-75 p-1 rounded shadow z-10">
              <button 
                onClick={handleZoomIn} 
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                title="Aumentar Zoom"
              >
                +
              </button>
              <button 
                onClick={handleZoomOut} 
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded mt-1"
                title="Diminuir Zoom"
              >
                -
              </button>
              <button 
                onClick={handleReset} 
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded mt-1"
                title="Resetar Visualização"
              >
                ↺
              </button>
              <div className="text-xs text-center mt-1">
                {(zoom * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="w-full overflow-hidden">
              <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6 text-center font-bold">Simulador de Braço Robótico</h2>
              
              {renderRoboticArm(renderConfig, svgRef)}
            </div>
          </div>
          
          <div className="mt-4 bg-white p-3 sm:p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Torques nas Juntas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              {['M1', 'M2', 'M3'].map(joint => (
                <div 
                  key={joint}
                  className="p-3 rounded" 
                  style={{ 
                    background: `linear-gradient(to right, rgba(76, 175, 80, 0.2), rgba(${getTorqueColor(torques[joint].Nm, joint)}, 0.2))`,
                    borderLeft: `4px solid ${getTorqueColor(torques[joint].Nm, joint)}`
                  }}
                >
                  <h4 className="font-medium text-sm">{joint}</h4>
                  <p 
                    className="text-xl font-bold" 
                    style={{ color: getTorqueColor(torques[joint].Nm, joint) }}
                  >
                    {torques[joint].Nm} Nm
                  </p>
                  <p className="text-sm text-gray-600">{torques[joint].kgfcm} kgf·cm</p>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Coordenadas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-1 px-2 border text-left text-sm">Junta</th>
                    <th className="py-1 px-2 border text-left text-sm">X (cm)</th>
                    <th className="py-1 px-2 border text-left text-sm">Y (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(coordinates).map(([joint, coord]) => (
                    <tr key={joint}>
                      <td className="py-1 px-2 border">{joint}</td>
                      <td className="py-1 px-2 border">{coord.x.toFixed(2)}</td>
                      <td className="py-1 px-2 border">{coord.y.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs sm:text-sm text-gray-600">
        <p>Ajuste os parâmetros no painel esquerdo para ver como os torques mudam em tempo real.</p>
        <p>Os torques são calculados considerando apenas as forças gravitacionais.</p>
      </div>
      <div>
        <p><a href='https://ricardojlrufino.github.io/calculadora-torque-interativa/' >Visite a calculadora de torque simplificada</a></p>
      </div>
    </div>
  );
};

export default RoboticArmSimulator;