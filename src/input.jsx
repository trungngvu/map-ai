/* eslint-disable react/prop-types */
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const Input = ({ text, places, onChange }) => {
  const data = places.map((place, index) => {
    return { label: place[0], id: index, coordinate: [place[1], place[2]] };
  });
  return (
    <Autocomplete
      disablePortal
      onChange={onChange}
      id="combo-box-demo"
      options={data}
      sx={{ width: 300 }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => <TextField {...params} label={text} />}
    />
  );
};

export default Input;
