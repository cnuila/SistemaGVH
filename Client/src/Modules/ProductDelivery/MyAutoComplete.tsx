import { Stack, Autocomplete, TextField } from '@mui/material'
import { useState, useEffect } from 'react'
import DeliveryLocationService from '../../Services/DeliveryLocationService'

export const MyAutoComplete = () => {
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  
  useEffect(() => {
    DeliveryLocationService.getDeliveryLocationNames().then(response => {
      setOptions(response.data);
    });
  }, []);
  
  return (
    <Stack spacing={4} direction="row" sx={{ width: '100%' }}>
      <Autocomplete
        id="deliveryLocationId__name2"
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Options" variant="outlined" margin="normal" required fullWidth type="text"/>}
        value={value}
        onChange={(event: any, newValue: string | null) => {
          setValue(newValue);
        }}
      />
    </Stack>
  )
}

