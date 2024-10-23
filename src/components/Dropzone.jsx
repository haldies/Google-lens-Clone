import { useState } from 'react';

const DropzoneImage = ({ setFile }) => {
    const [file, setLocalFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setLocalFile(selectedFile);
        setFile(selectedFile);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        setLocalFile(selectedFile);
        setFile(selectedFile);
        setIsDragging(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="flex items-center justify-center w-full">
            {file ? (
                <div className="flex items-center justify-center w-full h-64 bg-gray-100 dark:bg-gray-700">
                    <img
                        className="object-contain w-full h-full"
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                    />
                </div>
            ) : (
                <label
                    htmlFor="dropzoneImage-file"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ${isDragging ? 'border-blue-500' : 'border-gray-300'}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                       
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                    </div>
                    <input
                        id="dropzoneImage-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            )}
        </div>
    );
};

export default DropzoneImage;
