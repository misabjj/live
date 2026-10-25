import type { ComponentPropsWithRef } from 'react';
import { Form as AriaForm } from 'react-aria-components';

export const Form = (props: ComponentPropsWithRef<typeof AriaForm>) => {
    return <AriaForm validationBehavior="aria" {...props} />;
};

Form.displayName = 'Form';
