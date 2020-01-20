const imageHandler = () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();

        formData.append('image', file);

        // Save current cursor state
        const range = editor_sett.getSelection(true);

        // Insert temporary loading placeholder image
        //editor_sett.insertEmbed(range.index, 'image', `${ window.location.origin }{{url_for('static',filename='loading/loading.gif')}}`); 

        // Move cursor to right side of image (easier to continue typing)
        editor_sett.setSelection(range.index + 1);

        // Post to an api endpoint which uploads to s3. It returns the s3 url

        var res = null;

        res = await axios.post('https://newapp.nl/api/upload_post',formData,{progress: false}).then(function request(response){
            return response.data.image
        })

        // Remove placeholder image
        editor_sett.deleteText(range.index, 1);

        // Insert uploaded image
        editor_sett.insertEmbed(range.index, 'image', 'https://newapp.nl'+res); 
    }
}