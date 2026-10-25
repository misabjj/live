import { Avatar } from '@/components/untitled-ui/base/avatar/avatar';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { FileTrigger } from '@/components/untitled-ui/base/file-upload-trigger/file-upload-trigger';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface AvatarFormFieldProps extends Omit<FormFieldProps, 'children'> {
    src: string | null;
    initials?: string;
    onUpload: (files: FileList | null) => void;
    onDelete: () => void;
    avatarSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    uploadButtonText?: string;
    deleteButtonText?: string;
    acceptedFileTypes?: string[];
    allowMultiple?: boolean;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Avatar upload form field with preview, upload, and delete functionality.
 * Displays the current avatar with actions to update or remove it.
 */
export function AvatarFormField({
    title,
    description,
    isRequired = false,
    error,
    src,
    initials,
    onUpload,
    onDelete,
    avatarSize = '2xl',
    uploadButtonText = 'Update',
    deleteButtonText = 'Delete',
    acceptedFileTypes = ['image/*'],
    allowMultiple = false,
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: AvatarFormFieldProps) {
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
            <div className="flex items-center gap-x-3 md:items-start md:justify-between">
                <Avatar size={avatarSize} src={src} initials={initials} aria-label={title} />

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
