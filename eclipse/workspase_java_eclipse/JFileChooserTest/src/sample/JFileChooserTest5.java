package sample;



import java.awt.BorderLayout;
import java.awt.Dimension;
/*
import java.awt.Dimension;
import java.awt.BorderLayout;
*/
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import javax.imageio.ImageIO;
/*画像も削除できるようにしたい*/
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;

// JFileChooserTest5

public class JFileChooserTest5 extends JFrame implements ActionListener{

  JTextArea textarea;


  public static void main(String[] args){
    JFileChooserTest5 frame = new JFileChooserTest5();

    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.setBounds(100, 100, 600, 500);
    frame.setTitle("タイトル");
    frame.setVisible(true);
  }

  JFileChooserTest5(){
    JButton button = new JButton("file select");
    button.addActionListener(this);

    JPanel buttonPanel = new JPanel();
    buttonPanel.add(button);

    textarea = new JTextArea();
    textarea.setLineWrap(true);

    JScrollPane scrollpane = new JScrollPane(textarea);
    scrollpane.setPreferredSize(new Dimension(500, 300));

    JPanel textPanel = new JPanel();
    textPanel.add(scrollpane);

    getContentPane().add(textPanel, BorderLayout.CENTER);
    getContentPane().add(buttonPanel, BorderLayout.PAGE_END);
  }

  public void actionPerformed(ActionEvent e){
    JFileChooser filechooser = new JFileChooser();

    int selected = filechooser.showOpenDialog(this);
    if (selected == JFileChooser.APPROVE_OPTION){
      File file = filechooser.getSelectedFile();

      textarea.setText("");
      /* // 消去文
   if (file.exists()){
      if (file.delete()){
          //     System.out.println("ファイルを削除しました");
      }else{
          //     System.out.println("ファイルの削除に失敗しました");
      }
    }else{
       //  System.out.println("ファイルが見つかりません");
    }
      */

      try{
        if (checkBeforeReadfile(file)){
          BufferedReader br
            = new BufferedReader(new FileReader(file));

          String str;
          String[] lstr = new String[500];//要素がないところはすべてnull
          //ちなみにString[] lstr;だけでは実体が無い
          //      for(int i=0;i<500;i++)lstr[i]=null;
          int i=0;

          BufferedImage img = ImageIO.read(file);
          if(img == null) {
          while((str = br.readLine()) != null){
              if(i<500)lstr[i]=str;
            textarea.append(str);
            textarea.append("¥n");
            i+=1;
          }
          }
          /*文字列を文字の配列に変換して表示*/
          //      String[] ar = str.split("");//文字列を文字として配列に入れ直す
          //      int strlen = ar.length;//長さ取得
          //      Arrays.stream(ar).forEach(e -> System.out.println(e));  //配列の
          //内容をプリント

          br.close();
        }else{
          System.out.println("ファイルが見つからないか開けません");
        }
      }catch(FileNotFoundException err){
        System.out.println(err);
      }catch(IOException err){
        System.out.println(err);
      }

      try {
          BufferedImage img = ImageIO.read(file);
      }catch(IOException err) {
    	  System.out.println(err);
      }



    }
  }



  private static boolean checkBeforeReadfile(File file){
    if (file.exists()){
      if (file.isFile() && file.canRead()){
        return true;
      }
    }

    return false;
  }
}
