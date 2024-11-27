
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
type Country = {
    isoCode: string;
    name: string;
};

type State = {
    isoCode: string;
    name: string;
};


type FilterByCountriesProps = {
    selectedCountry: string;
    setSelectedCountry: (value: string) => void;
    selectedState: string;
    setSelectedState: (value: string) => void;

    countries: Country[];
    states: State[];

};


const FilterByCountries = ({ selectedCountry, setSelectedCountry, setSelectedState,
    countries, selectedState,
    states }: FilterByCountriesProps) => {


    return (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            <Select
                value={selectedCountry}
                onValueChange={(value) => {
                    setSelectedCountry(value);
                    setSelectedState('');

                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                    {countries.map((country) => (
                        <SelectItem
                            key={country.isoCode}
                            value={country.isoCode}
                        >
                            {country.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            {selectedCountry && (
                <Select
                    value={selectedState}
                    onValueChange={(value) => {
                        setSelectedState(value.trim());

                    }}
                    disabled={states.length === 0}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select State/Province" />
                    </SelectTrigger>
                    <SelectContent>
                        {states.map((state) => (
                            <SelectItem
                                key={state.name}
                                value={state.name}
                            >
                                {state.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>

    )
}

export default FilterByCountries