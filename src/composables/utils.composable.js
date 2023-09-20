export const capitalize = ( str, separator = ' ' ) => {
  return str.split ( separator )
    .map( word => capitalize_word ( word ) ). join ( separator )
}
function capitalize_word ( word ) {
  const word_array = [ ...word ] 
  const first_letter = word_array.shift ()
  const capitalized = [ first_letter.toUpperCase (), ...word_array ].join ( '' )
  return capitalized
}

export default () => ({
  capitalize,
})