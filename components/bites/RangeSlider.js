// components/CustomRangeSlider.jsx
import React, { useState, useRef, useEffect } from 'react';

const CustomRangeSlider = ({
    min = 0,
    max = 100,
    step = 1,
    initialValue = 50,
    onChange,
    hidePercentage = false
}) => {
    const [value, setValue] = useState(initialValue);
    const sliderRef = useRef(null);
    const thumbRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate percentage based on current value
    const percentage = ((value - min) / (max - min)) * 100;

    // Function to calculate value based on pointer position
    const calculateValue = (clientX) => {
        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        let newPercentage = ((clientX - rect.left) / rect.width) * 100;
        newPercentage = Math.max(0, Math.min(100, newPercentage));
        const rawValue = (newPercentage / 100) * (max - min) + min;
        // Align the value with the step
        const steppedValue = Math.round(rawValue / step) * step;
        return Math.min(max, Math.max(min, steppedValue));
    };

    // Handler for updating value during dragging
    const updateValue = (clientX) => {
        const newValue = calculateValue(clientX);
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    // Pointer event handlers
    const handlePointerDown = (event) => {
        event.preventDefault();
        setIsDragging(true);
        updateValue(event.clientX);

        // Capture all pointer events
        thumbRef.current.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!isDragging) return;
        updateValue(event.clientX);
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    // Click on slider to set value
    const handleSliderClick = (event) => {
        const newValue = calculateValue(event.clientX);
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    // Add event listeners for pointer events when dragging
    useEffect(() => {
        const slider = sliderRef.current;

        if (isDragging) {
            slider.addEventListener('pointermove', handlePointerMove);
            slider.addEventListener('pointerup', handlePointerUp);
            slider.addEventListener('pointercancel', handlePointerUp);
        } else {
            slider.removeEventListener('pointermove', handlePointerMove);
            slider.removeEventListener('pointerup', handlePointerUp);
            slider.removeEventListener('pointercancel', handlePointerUp);
        }

        // Cleanup on unmount
        return () => {
            slider.removeEventListener('pointermove', handlePointerMove);
            slider.removeEventListener('pointerup', handlePointerUp);
            slider.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [isDragging]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <div className="w-full p-4">
            <div
                className="relative w-full h-[6px] bg-gray-100 rounded-sm cursor-pointer"
                ref={sliderRef}
                onClick={handleSliderClick}
            >
                {/* Background Track */}
                <div className="absolute w-full h-full bg-gray-200 rounded-sm"></div>
                {/* Filled Range */}
                <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
                {/* Thumb */}
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full cursor-grab flex justify-center items-center"
                    ref={thumbRef}
                    onPointerDown={handlePointerDown}
                    style={{ left: `${percentage}%`, zIndex: 10 }}
                >
                    {/* Tooltip */}
                    {!hidePercentage && <div className="absolute top-[-45px] bg-gray-100 text-black px-4 py-2 rounded-sm whitespace-nowrap shadow-md">
                        {value}%
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default CustomRangeSlider;
