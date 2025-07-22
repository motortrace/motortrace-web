import React, { useRef, useState } from 'react';
import { Settings, Upload } from 'lucide-react'
import "./AdminSettings.scss"

const GeneralSettings = () => {

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
        <div className="admin-settings">
            <div className="admin-settings__header">
                <Settings size={24} />
                <h3 className="admin-settings__title">
                    General Settings
                </h3>
            </div>

            <div className="admin-settings__input-row" >
                <div>
                    <label>
                        Platform Name
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" value="MotorTrace" />
                </div>

                <div>
                    <label>
                        Platform Tagline
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" value="Your Integrated Automotive Platform" />
                </div>

            </div>

            <div className="admin-settings__input-row" >
                <div>
                    <label>
                        Contact Email
                        <span className="input-required">*</span>
                    </label>
                    <input type="email" value="motortrace64@gmail.com" />
                </div>

                <div>
                    <label>
                        Contact Phone
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" value="+94 11 234 5678" />
                </div>

            </div>

            <label>
                Platform Logo
                <span className="input-required">*</span>
            </label>
            
            <div className="admin-settings__input-row" >

                <div className="file-upload-container" onClick={handleContainerClick}>
                    <Upload style={{ color: '#6c757d', marginBottom: '8px' }} size={40} />
                    <div className="file-upload-text">
                        {fileName ? fileName : "Click to Upload Your Platform Logo"}
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

export default GeneralSettings
