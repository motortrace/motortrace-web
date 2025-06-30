import React, { useRef, useState } from 'react';
import { Info, Upload } from 'lucide-react';
import './BasicInformation.scss'


const BasicInformation = () => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fileName, setFileName] = useState<string | null>(null);

    const handleContainerClick = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Safe access
        if (file) {
            setFileName(file.name);
            console.log('Selected file:', file);
        }
    };

    return (
        <div className="basic-info">

            <div className="basic-info__header">
                <Info size={24} />
                <h3 className="basic-info__title">
                    Basic Information
                </h3>

            </div>

            <div className="basic-info__input-row" >
                <div>
                    <label>
                        Service Center Name
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" placeholder="Enter your service center name" />
                </div>

                <div>
                    <label>
                        Business Registration Number
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" placeholder="Enter your service center's business registartion number" />
                </div>

            </div>

            <div className="basic-info__input-row" >
                <div>
                    <label>
                        Primary Phone Number
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" placeholder="Enter primary phone number" />
                </div>

                <div>
                    <label> Secondary Phone Number (Optional) </label>
                    <input type="text" placeholder="Enter secondary phone number (optional)" />
                </div>

            </div>

            <div className="basic-info__input-row" >
                <div>
                    <label>
                        Business Email Address
                        <span className="input-required">*</span>
                    </label>
                    <input type="email" placeholder="Enter email address" />
                </div>

                <div>
                    <label>
                        Years of Experience
                        <span className="input-required">*</span>
                    </label>
                    <select>
                        <option> Select years of experience </option>
                        <option> 1-2 Years </option>
                        <option> 3-4 Years </option>
                        <option> 5-6 Years </option>
                        <option> 6-8 Years </option>
                        <option> 8-10 Years </option>
                        <option> 10+ Years </option>
                    </select>
                </div>

            </div>

            <label>
                Business Logo
                <span className="input-required">*</span>
            </label>
            <div className="basic-info__input-row" >

                <div className="file-upload-container" onClick={handleContainerClick}>
                    <Upload style={{ color: '#6c757d', marginBottom: '8px' }} size={40} />
                    <div className="file-upload-text">
                        {fileName ? fileName : "Click to upload your business logo"}
                    </div>
                    <div className="file-upload-helper">Supported formats: JPG, PNG, WEBP. Maximum file size: 5MB</div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}

                    />
                </div>
            </div>

        </div>
    )
}

export default BasicInformation
