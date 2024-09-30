import { FormularioProvider } from './FormularioContext';
import Wizar from './Wizar';

export default function Form() {
    return (
        <FormularioProvider>
            <Wizar />
        </FormularioProvider>
    );
}
