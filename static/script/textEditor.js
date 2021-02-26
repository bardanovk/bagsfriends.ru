//import EditorJS from 'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest'


const editor = new EditorJS({
    /** 
     * Id of Element that should contain the Editor 
     */
    holder: 'editorjs',

    /** 
     * Available Tools list. 
     * Pass Tool's class or Settings object for each Tool you want to use 
     */
    tools: {
        header: {
            class: Header,
            inlineToolbar: ['link']
        },
        image: {
            class: ImageTool,
            config: {
                endpoints: {
                    byFile: 'http://localhost:3000/manage/news/uploadPhoto', // Your backend file uploader endpoint
                    byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                }
            }
        },

        list: {
            class: List,
            inlineToolbar: true,
        },
        embed: {
            class: Embed,
            config: {
                services: {
                    youtube: true,
                    coub: true,
                    instagram: true
                }

            },
        },

    }
})

function OnSave() {

    editor.save().then((outputData) => {

        outputDataText = JSON.stringify(outputData)
        document.getElementById('data').value = outputDataText
        console.log('art', outputData);
    })
}