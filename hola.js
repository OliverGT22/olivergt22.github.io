function showPopup()
    {
        var data = document.getElementById("value").value;
        //check empty data field
        if(data == "")
        {
           alert("Ingresa un valor..");
        }
        else
        {
            alert("El valor ingresado es: "+data); //display variable along with the string
        }
    }
