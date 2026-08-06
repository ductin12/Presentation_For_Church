!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Bạn có muốn xóa toàn bộ dữ liệu ứng dụng (bài hát, kho media, cấu hình...) của Presentation For Church không?$\n$\nChọn 'No' (Mặc định) để giữ lại dữ liệu cho lần cài đặt sau." IDNO keepAppData
    RMDir /r "$APPDATA\Presentation For Church"
    RMDir /r "$APPDATA\easyworship-app"
    RMDir /r "$APPDATA\com.church.presentation"
  keepAppData:
!macroend
