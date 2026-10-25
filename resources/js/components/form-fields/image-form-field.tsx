import { Button } from '@/components/untitled-ui/base/buttons/button';
import { FileTrigger } from '@/components/untitled-ui/base/file-upload-trigger/file-upload-trigger';
import { cx } from '@/utils/cx';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface ImageFormFieldProps extends Omit<FormFieldProps, 'children'> {
    src: string | null;
    onUpload: (files: FileList | null) => void;
    onDelete: () => void;
    uploadButtonText?: string;
    deleteButtonText?: string;
    acceptedFileTypes?: string[];
    allowMultiple?: boolean;
    previewHeight?: string;
    previewAlt?: string;
    showPreview?: boolean;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Image upload form field with optional preview, upload, and delete functionality.
 * Suitable for background images, banners, or any image upload use case.
 */
export function ImageFormField({
    title,
    description,
    isRequired = false,
    error,
    src,
    onUpload,
    onDelete,
    uploadButtonText = 'Update',
    deleteButtonText = 'Delete',
    acceptedFileTypes = ['image/*'],
    allowMultiple = false,
    previewHeight = 'h-40',
    previewAlt = 'Image preview',
    showPreview = true,
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: ImageFormFieldProps) {
    return (
        <FormField
            title={title}
            description={description}
            isRequired={isRequired}
            error={error}
            className={className}
            hideDesktopLabel={hideDesktopLabel}
            hideMobileLabel={hideMobileLabel}
            labelPosition={labelPosition}
        >
            <div className="flex flex-col gap-4" aria-label={title}>
                {showPreview && src && (
                    <div className={cx(previewHeight, 'w-full overflow-hidden rounded-lg border border-border-secondary')}>
                        <img src={src} alt={previewAlt} className="h-full w-full object-cover" />
                    </div>
                )}

                <div className="flex gap-4">
                    <Button color="link-gray" size="sm" onClick={onDelete} isDisabled={!src}>
                        {deleteButtonText}
                    </Button>
                    <FileTrigger acceptedFileTypes={acceptedFileTypes} onSelect={onUpload} allowsMultiple={allowMultiple}>
                        <Button color="link-color" size="sm">
                            {uploadButtonText}
                        </Button>
                    </FileTrigger>
                </div>
            </div>
        </FormField>
    );
}
