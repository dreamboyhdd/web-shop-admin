import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch } from "react-redux";
import { mainAction } from "../../Redux/Actions";

const MyEditorCompo = ({
  onChange = () => { },
  values = '<p></p>',
  height = 400,
}) => {
  const dispatch = useDispatch();

  const handleFileChange = async (event) => {
    const input = event.target;
    const formData = new FormData();
    formData.append("Key", "Product");
    for (let i = 0; i < input.files.length; i++) {
      formData.append("myFile" + i, input.files[i]);
    }
    try {
      const response = await mainAction.API_spCallPostImage(formData, dispatch);
      if (response) {
        let _img = response.Message.replaceAll('"', "");
        let listimage = _img.replace("[", "").replace("]", "");
        return 'https://mediaimages.vps.vn/' + listimage;
      } else {
        return 'Không upload được ảnh'
      }
    } catch (error) {
      console.error("Lỗi:", error);
      return null;
    }
  };

  return (
    <div className='col-12'>

      <Editor
        init={{
          selector: 'textarea#open-source-plugins',
          plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap  emoticons',
          imagetools_cors_hosts: ['picsum.photos'],
          menubar: 'file edit view insert format tools table help',
          toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
          toolbar_sticky: true,
          autosave_ask_before_unload: true,
          autosave_interval: '30s',
          autosave_restore_when_empty: false,
          autosave_retention: '2m',
          image_advtab: true,
          importcss_append: true,
          template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
          height: height,
          image_caption: true,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          noneditable_noneditable_class: 'mceNonEditable',
          toolbar_mode: 'sliding',
          contextmenu: 'link image imagetools table',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          file_picker_callback: async function (callback, value, meta) {
            if (meta.filetype === 'image') {
              const input = document.getElementById('my-file');
              input.click();
              input.onchange = async function (event) {
                const listimage = await handleFileChange(event);
                if (listimage) {
                  callback(listimage, {
                    alt: input.files[0]?.name || ""
                  });
                }
              };
            }
          },
        }}
        apiKey="57jwf1xebx7p6gabbqrvl3ojona8l9rs32mlzchwn5ulhylq"
        onEditorChange={(content, editor) => {
          onChange(content);
        }}
        value={values}
      />
      <input id="my-file" type="file" name="my-file" style={{ display: "none" }} multiple />
    </div>
  );
};
export const MyEditor = React.memo(MyEditorCompo)

