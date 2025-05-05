import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function Products() {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const isSmallDevice = useMediaQuery("(max-width: 600px)");
    const theme = useTheme();

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ 
                backgroundColor: theme.palette.background.alt, 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                borderRadius: "0.55rem",
                color: theme.palette.secondary[100],
                fontFamily: theme.typography.fontFamily
            }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
                        {formatedValue} / 2 GB
                    </Typography>
                    <ProgressBar 
                        value={value} 
                        showValue={false} 
                        style={{ 
                            width: '10rem', 
                            height: '8px', 
                            backgroundColor: theme.palette.primary[600],
                            '& .p-progressbar-value': {
                                backgroundColor: theme.palette.secondary[300]
                            }
                        }}
                    />
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap" style={{ 
                backgroundColor: theme.palette.background.alt, 
                padding: '1rem', 
                borderRadius: "0.55rem",
                marginBottom: '0.5rem',
                color: theme.palette.secondary[100],
                fontFamily: theme.typography.fontFamily
            }}>
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} style={{ borderRadius: '4px' }} />
                    <Box ml="1rem">
                        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
                            {file.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.secondary[300] }}>
                            {new Date().toLocaleDateString()}
                        </Typography>
                    </Box>
                </div>
                <Tag 
                    value={props.formatSize} 
                    severity="warning" 
                    style={{ 
                        backgroundColor: theme.palette.secondary[300], 
                        color: theme.palette.background.alt,
                        borderRadius: '4px',
                        padding: '0.5rem 1rem'
                    }} 
                />
                <Button 
                    type="button" 
                    icon="pi pi-times" 
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto" 
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                    style={{ 
                        borderColor: theme.palette.secondary[300], 
                        color: theme.palette.secondary[300],
                        width: '2.5rem',
                        height: '2.5rem'
                    }}
                />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column" style={{ 
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.palette.background.alt,
                fontFamily: theme.typography.fontFamily
                
            }}>
                <i className="pi pi-cloud-upload mt-3 p-5" style={{ 
                    fontSize: '3.5em', 
                    borderRadius: '50%', 
                    backgroundColor: theme.palette.background.alt, 
                    color: theme.palette.secondary[300],
                    padding: '2rem'
                }}></i>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: theme.palette.secondary[100],
                        mt: '1rem'
                    }}
                >
                    Drag and Drop Video Here
                </Typography>
                
            </div>
        );
    };

    const chooseOptions = { 
        icon: 'pi pi-video', 
        iconOnly: true, 
        className: 'custom-choose-btn p-button-rounded p-button-outlined',
        style: { 
            backgroundColor: 'transparent', 
            borderColor: theme.palette.secondary[300], 
            color: theme.palette.secondary[300],
            width: '2.5rem',
            height: '2.5rem',
            margin: '0 0.5rem'
        }
    };

    const uploadOptions = { 
        icon: 'pi pi-cloud-upload', 
        iconOnly: true, 
        className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
        style: { 
            backgroundColor: 'transparent', 
            borderColor: theme.palette.secondary[300], 
            color: theme.palette.secondary[300],
            width: '2.5rem',
            height: '2.5rem',
            margin: '0 0.5rem'
        }
    };

    const cancelOptions = { 
        icon: 'pi pi-times', 
        iconOnly: true, 
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
        style: { 
            backgroundColor: 'transparent', 
            borderColor: theme.palette.secondary[300], 
            color: theme.palette.secondary[300],
            width: '2.5rem',
            height: '2.5rem',
            margin: '0 0.5rem'
        }
    };

    return (
        <Box
            display="flex"
            flexDirection={isSmallDevice ? "column" : "row"}
            justifyContent="center"
            alignItems="stretch"
            gap="2rem"
            p="2rem"
            sx={{
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                minHeight: "calc(100vh - 100px)",
                '& .p-fileupload': {
                    flex: 1,
                    width: '100%',
                    minHeight: '400px',
                    '& .p-fileupload-content': {
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.background.alt // Using indigo color from theme
                    }
                }
            }}
        >
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload 
                ref={fileUploadRef} 
                name="demo1[]" 
                url="/api/upload" 
                multiple 
                accept="video/mp4" 
                maxFileSize={16000000000}
                onUpload={onTemplateUpload} 
                onSelect={onTemplateSelect} 
                onError={onTemplateClear} 
                onClear={onTemplateClear}
                headerTemplate={headerTemplate} 
                itemTemplate={itemTemplate} 
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} 
                uploadOptions={uploadOptions} 
                cancelOptions={cancelOptions} 
                style={{ 
                    width: '100%',
                    height: '100%',
                }}
            />

            <FileUpload 
                ref={fileUploadRef} 
                name="demo2[]" 
                url="/api/upload" 
                multiple 
                accept="video/mp4" 
                maxFileSize={16000000000}
                onUpload={onTemplateUpload} 
                onSelect={onTemplateSelect} 
                onError={onTemplateClear} 
                onClear={onTemplateClear}
                headerTemplate={headerTemplate} 
                itemTemplate={itemTemplate} 
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} 
                uploadOptions={uploadOptions} 
                cancelOptions={cancelOptions}
                style={{ 
                    width: '100%',
                    height: '100%'
                }}
            />
        </Box>
    );
}