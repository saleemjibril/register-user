import axios from "axios";

export default function fileUpload(
  e,
  setListItem,
  setLoading,
  auth
) {

  console.log('started image upoload');
  
  


  // let files = e.target.files;
  // let allUploadedFiles = images;

  const fileToUri = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };

  if (e) {
    setLoading(true);

    // for (let i = 0; i < files.length; i++) {
    fileToUri(e, (err, result) => {
      if (result) {
        axios
          .post(
            // `${process.env.REACT_APP_DEV_URL}/files/upload`,
            `${process.env.REACT_APP_API_URL}/files/upload`,
            {
              image: result,
            },
            {
              headers: {
                Authorization: `Bearer ${auth ? auth.token : ""}`,
              },
            }
          )
          .then((response) => {
            console.log('response from image upload', response);

              setListItem(response?.data?.url);
            
            // setPoemMedia(response?.data);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.log("ERROR", error);
            if (error?.response?.data?.message) {
              alert(error?.response?.data?.message);
            } else {
              alert(error?.response?.statusText);
            }
          });
      }
    });
    // }
  }
}
