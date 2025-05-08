import React from 'react';

/**
 * Renderiza o braço robótico em um elemento SVG
 * @param {Object} config - Configuração para renderização
 * @param {Object} svgRef - Referência para o elemento SVG
 * @returns {JSX.Element} Elemento SVG renderizado
 */
export const renderRoboticArm = (config, svgRef) => {
  const {
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
    zoom
  } = config;

  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      preserveAspectRatio="xMidYMid meet"
      ref={svgRef}
      onMouseDown={handleMouseDown}
      style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab' }}
    >
      <g transform={`translate(${dragState.translateX}, ${dragState.translateY})`}>
        {renderGrid(svgWidth, svgHeight, colors)}
        
        {renderAxes(centerX, centerY, svgWidth, svgHeight)}
        
        {renderBase(centerX, centerY, colors)}
        
        {renderLinks(centerX, centerY, coordinates, scale, linkColors)}
        
        {renderJoints(centerX, centerY, coordinates, scale, colors)}
        
        {renderLoad(centerX, centerY, coordinates, scale, colors)}
        
        {renderLabels(centerX, centerY, coordinates, scale)}
        
        {renderTorqueIndicators(centerX, centerY, coordinates, scale, torques, getTorqueColor)}
      </g>
    </svg>
  );
};

/**
 * Renderiza a grade de fundo
 */
const renderGrid = (svgWidth, svgHeight, colors) => {
  return (
    <g>
      {[...Array(20)].map((_, i) => (
        <line 
          key={`h-${i}`}
          x1="0" 
          y1={i * 20} 
          x2={svgWidth} 
          y2={i * 20} 
          stroke={colors.grid} 
          strokeWidth="1" 
        />
      ))}
      {[...Array(25)].map((_, i) => (
        <line 
          key={`v-${i}`}
          x1={i * 20} 
          y1="0" 
          x2={i * 20} 
          y2={svgHeight} 
          stroke={colors.grid} 
          strokeWidth="1" 
        />
      ))}
    </g>
  );
};

/**
 * Renderiza os eixos X e Y
 */
const renderAxes = (centerX, centerY, svgWidth, svgHeight) => {
  return (
    <>
      <line x1="0" y1={centerY} x2={svgWidth} y2={centerY} stroke="#999" strokeWidth="1" />
      <line x1={centerX} y1="0" x2={centerX} y2={svgHeight} stroke="#999" strokeWidth="1" />
    </>
  );
};

/**
 * Renderiza a base do braço robótico
 */
const renderBase = (centerX, centerY, colors) => {
  return (
    <rect 
      x={centerX - 50} 
      y={centerY - 10} 
      width="80" 
      height="30" 
      fill={colors.base} 
      stroke="#333" 
      strokeWidth="1" 
    />
  );
};

/**
 * Renderiza os links do braço robótico
 */
const renderLinks = (centerX, centerY, coordinates, scale, linkColors) => {
  return (
    <>
      <line 
        x1={centerX} 
        y1={centerY} 
        x2={centerX + coordinates.M2.x * scale} 
        y2={centerY + coordinates.M2.y * scale} 
        stroke={linkColors.L1} 
        strokeWidth="6" 
      />
      <line 
        x1={centerX + coordinates.M2.x * scale} 
        y1={centerY + coordinates.M2.y * scale} 
        x2={centerX + coordinates.M3.x * scale} 
        y2={centerY + coordinates.M3.y * scale} 
        stroke={linkColors.L2} 
        strokeWidth="6" 
      />
      <line 
        x1={centerX + coordinates.M3.x * scale} 
        y1={centerY + coordinates.M3.y * scale} 
        x2={centerX + coordinates.LOAD.x * scale} 
        y2={centerY + coordinates.LOAD.y * scale} 
        stroke={linkColors.L3} 
        strokeWidth="6" 
      />
    </>
  );
};

/**
 * Renderiza as juntas do braço robótico
 */
const renderJoints = (centerX, centerY, coordinates, scale, colors) => {
  return (
    <>
      <circle cx={centerX} cy={centerY} r="12" fill={colors.joint} />
      <circle 
        cx={centerX + coordinates.M2.x * scale} 
        cy={centerY + coordinates.M2.y * scale} 
        r="10" 
        fill={colors.joint} 
      />
      <circle 
        cx={centerX + coordinates.M3.x * scale} 
        cy={centerY + coordinates.M3.y * scale} 
        r="10" 
        fill={colors.joint} 
      />
    </>
  );
};

/**
 * Renderiza a carga no final do braço
 */
const renderLoad = (centerX, centerY, coordinates, scale, colors) => {
  return (
    <rect 
      x={centerX + coordinates.LOAD.x * scale - 12} 
      y={centerY + coordinates.LOAD.y * scale - 12} 
      width="24" 
      height="24" 
      fill={colors.load} 
      stroke="#333" 
    />
  );
};

/**
 * Renderiza os rótulos de texto para cada junta
 */
const renderLabels = (centerX, centerY, coordinates, scale) => {
  return (
    <>
      <text x={centerX - 20} y={centerY + 30} fontSize="12" fill="#000">M1</text>
      <text 
        x={centerX + coordinates.M2.x * scale - 20} 
        y={centerY + coordinates.M2.y * scale - 15} 
        fontSize="12" 
        fill="#000"
      >
        M2
      </text>
      <text 
        x={centerX + coordinates.M3.x * scale - 20} 
        y={centerY + coordinates.M3.y * scale - 15} 
        fontSize="12" 
        fill="#000"
      >
        M3
      </text>
      <text 
        x={centerX + coordinates.LOAD.x * scale - 15} 
        y={centerY + coordinates.LOAD.y * scale - 15} 
        fontSize="12" 
        fill="#000"
      >
        LOAD
      </text>
    </>
  );
};

/**
 * Renderiza os indicadores de torque para cada junta
 */
const renderTorqueIndicators = (centerX, centerY, coordinates, scale, torques, getTorqueColor) => {
  return ['M1', 'M2', 'M3'].map((joint, index) => {
    const cx = joint === 'M1' ? centerX : 
             centerX + coordinates[joint].x * scale;
    const cy = joint === 'M1' ? centerY : 
             centerY + coordinates[joint].y * scale;
    const radius = 25 - (index * 4);
    
    return (
      <g key={joint}>
        <circle 
          cx={cx}
          cy={cy}
          r={radius}
          fill="none" 
          stroke={getTorqueColor(torques[joint].Nm, joint)} 
          strokeWidth="3" 
          strokeDasharray="5,3" 
          opacity="0.9"
        />
        <text 
          x={cx - 40}
          y={cy - 30}
          fontSize="14" 
          fontWeight="bold" 
          fill={getTorqueColor(torques[joint].Nm, joint)}
        >
          {torques[joint].kgfcm} kgf·cm
        </text>
      </g>
    );
  });
};