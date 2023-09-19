import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../Redux/Actions';
import { post } from 'axios';
import { LINKDomain, API_END_POINT } from "../../Services";
import { Alerterror } from '../../Utils';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
const TinyMCEComp = ({
    onSelected = () => { },
    Level = 0,
    Values = '<p><p>',
    height = 300
}) => {

    const { quill, quillRef } = useQuill();
    useEffect(() => {
        if (quill) {
            let changeFlag = false; // Add a flag to track changes

            quill.on('text-change', (delta, oldDelta, source) => {
                if (source === 'user') {
                    // Check if the change is triggered by user input
                    changeFlag = true;
                }
            });

            // Add an event listener to handle the change
            quill.root.addEventListener('blur', () => {
                if (changeFlag) {
                    const text = quill.root.innerHTML;
                    onSelected(text);
                    changeFlag = false; // Reset the flag after handling the change
                }
            });

            let initialContent = quill.clipboard.convert(Values);
            quill.setContents(initialContent, 'silent');
        }

    }, [quill]);

    useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(Values);
            onSelected(Values);
        }
    }, [Values]);

    const linkJob = LINKDomain;
    const dispatch = useDispatch();
    const [initialValue, setinitialValue] = useState('');

    const handleEditorChange = (item) => {
        onSelected(item.level.content);
    }
    const uploadFile = async (Uploadimg) => {
         
        let linkfile = "";
        if (Uploadimg !== undefined) {
            mainAction.LOADING({ IsLoading: true }, dispatch);
            const file = await fileUpload(Uploadimg);
            if (file && file.status === 201) {
                const dataimg = JSON.parse(file.data.Message);
                for (let f = 0; f < dataimg.length; f++) {
                    if (f !== "" && dataimg[f].includes(".jpg")) linkfile = linkfile + "<img width='400' src='" + linkJob + dataimg[f] + "' /> <br/>";
                    else if (f !== "" && dataimg[f].includes(".png")) linkfile = linkfile + "<img width='400'  src='" + linkJob + dataimg[f] + "' /> <br/>";
                    else if (f !== "" && dataimg[f].includes(".gif")) linkfile = linkfile + "<img width='400'  src='" + linkJob + dataimg[f] + "' /> <br/>";
                    else {
                        linkfile += '<span class="mce-preview-object mce-object-video" style="" contenteditable="false" data-mce-object="video" data-mce-p-controls="controls" data-mce-html="' + linkJob + dataimg[f] + '">';
                        linkfile += '<video width="600" height="348" controls="controls">';
                        linkfile += '<source src="' + linkJob + dataimg[f] + '" type="video/mp4"></source>';
                        linkfile += '</video>';
                        linkfile += '<span class="mce-shim"></span></span>';
                    }
                }
            }
        }

        //dangerouslySetInnerHTML("<p>"+linkfile+"</p>");


        //window.tinyMCE.activeEditor.execCommand("mceInsertContent", true, linkfile);
        //window.tinyMCE.activeEditor.setContent(linkfile);

        mainAction.LOADING({ IsLoading: false }, dispatch);
    }

    const fileUpload = async (file) => {
        try {
            const url = API_END_POINT + '/ApiMain/UploadImgJob';
            const formData = new FormData();
            for (let i = 0; i < file.length; i++) {
                formData.append('file', file[i]);
            }
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            return await post(url, formData, config)
        } catch (error) {
            Alerterror("Upload images fail,pls check")
        }
    }

    const [imgfile, setimgfile] = useState(null);
    const clickUpImages = () => {
        //uploadFile(imgfile);
    }

    const ImagesChange = (e) => {
        //setimgfile();
        uploadFile(e.target.files);
    }

    const [EmbleYoutube, setEmbleYoutube] = useState("")
    const addYoutube = () => {
        if (quill) {
            let initialContent = quill.clipboard.convert(EmbleYoutube);
            quill.setContents(initialContent, 'silent');
        }
    }


    return (
        <>
            <div className="col-md-12" style={{ width: '100%', backgroundColor: 'while', position: 'relative' }}>
                <div ref={quillRef} style={{ width: '100%', height: height + 'px' }} />
                {/* <span className="push-right" style={{position:'absolute',right:'0px',top:'5px'}}>
            Media: <input type="file" onChange={ImagesChange}/>
            </span> */}


                {/* 
        <Editor
            initialValue = {initialValue}
            value={initialValue}
            init={{
            height: height,
            width:'100%',
            image_title: true,
            image_caption: true,
            plugins: [ 'image code',
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality pageembed',
            'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help',
            'fullscreen'
            ],
            toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help | fontselect | fontsizeselect |pageembed| fullscreen',
            automatic_uploads: true,
            file_picker_types: 'image',
            media_live_embeds: true,
            
            // and here's our custom image picker
            file_picker_callback: function (cb, value, meta) {

                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('multiple', '');

                // Note: In modern browsers input[type="file"] is functional without
                // even adding it to the DOM, but that might not be the case in some older
                // or quirky browsers like IE, so you might want to add it to the DOM
                // just in case, and visually hide it. And do not forget do remove it
                // once you do not need it anymore.

                input.onChange = function () {
                    uploadFile(this.files);
                };
                input.click();
            },
            fontsize_formats: "8px 9px 10px 11px 12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 26px 27px 28px 29px 30px 31px 32px 33px 34px 35px 36px",
            theme_advanced_fonts : "Andale Mono=andale mono,times;"+
                        "Arial=arial,helvetica,sans-serif;"+
                        "Arial Black=arial black,avant garde;"+
                        "Book Antiqua=book antiqua,palatino;"+
                        "Comic Sans MS=comic sans ms,sans-serif;"+
                        "Courier New=courier new,courier;"+
                        "Georgia=georgia,palatino;"+
                        "Helvetica=helvetica;"+
                        "Impact=impact,chicago;"+
                        "Symbol=symbol;"+
                        "Tahoma=tahoma,arial,helvetica,sans-serif;"+
                        "Terminal=terminal,monaco;"+
                        "Times New Roman=times new roman,times;"+
                        "Trebuchet MS=trebuchet ms,geneva;"+
                        "Verdana=verdana,geneva;"+
                        "Webdings=webdings;"+
                        "Wingdings=wingdings,zapf dingbats"
                }
            }
            apiKey="1ffbdqk87810s2n1pauwhf93bz5hewlai6ssnvvsbpdr80w0"
            onChange={handleEditorChange}
            />
             */}
            </div>

            {/* <div className='row margin-top-5'>
                <h4>Emble Youtube:</h4>
                <textarea row="40" onChange={e => setEmbleYoutube(e.target.value)}>
                </textarea>
                <button className='btn btn-small btn-danger' onClick={addYoutube}>Add</button>
            </div> */}
        </>

    )
}


export const TinyMCE = React.memo(TinyMCEComp)