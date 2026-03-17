import React, { useState } from 'react';

// Define the props type (if necessary)
interface CheckboxProps {
    label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label }) => {
    // State to handle checked/unchecked status
    const [isChecked, setIsChecked] = useState<boolean>(false);

    // Handle the checkbox change
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div>
            <label style={{
                color: 'white'
            }}
            >
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    style={{
                        marginRight: '10px',
                    }} // Add some spacing and color to the checkbox
                />
                {label}
            </label>
        </div>
    );
};

export default Checkbox;