package sample;


import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.TransferHandler;

public class DropAndListFileName {

	private JFrame frame;
	private JTextArea textArea;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					DropAndListFileName window = new DropAndListFileName();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public DropAndListFileName() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setBounds(100, 100, 450, 300);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		JScrollPane scrollPane = new JScrollPane();
		frame.getContentPane().add(scrollPane, BorderLayout.CENTER);

		textArea = new JTextArea();
		scrollPane.setViewportView(textArea);

		// ドロップ操作を有効にする
		textArea.setTransferHandler(new DropFileHandler());
	}

	/**
	 * ドロップ操作の処理を行うクラス
	 */


	private class DropFileHandler extends TransferHandler {

		/**
		 * ドロップされたものを受け取るか判断 (ファイルのときだけ受け取る)
		 */
		@Override
		public boolean canImport(TransferSupport support) {
			if (!support.isDrop()) {
				// ドロップ操作でない場合は受け取らない
		        return false;
		    }

			if (!support.isDataFlavorSupported(DataFlavor.javaFileListFlavor)) {
				// ドロップされたのがファイルでない場合は受け取らない
		        return false;
		    }

			return true;
		}





		/**
		 * ドロップされたファイルを受け取る
		 */
		@Override
		public boolean importData(TransferSupport support) {
			// 受け取っていいものか確認する
			if (!canImport(support)) {
		        return false;
		    }

			// ドロップ処理
			Transferable t = support.getTransferable();
			try {
				// ファイルを受け取る
				List<File> files = (List<File>) t.getTransferData(DataFlavor.javaFileListFlavor);

				// テキストエリアに表示するファイル名リストを作成する
				StringBuffer fileList = new StringBuffer();
				for (File file : files){
					searchFile(file);
					fileList.append(file.getName());
					fileList.append("\n");
				}

				// テキストエリアにファイル名のリストを表示する
				textArea.setText(fileList.toString());
			} catch (UnsupportedFlavorException | IOException e) {
				e.printStackTrace();
			}
			return true;
		}
	}

	public void searchFile(File file) {
		String file_name = file.getName();
	}
}


/*
public class file_control{
public static void main(String[] args){
String dir_path = "/Users/user_name/dir/path/";  //検索開始したいフォルダのPath(今回の場合なら`~Folder/`まで書く)
String extension = ".csv";   //検索したいファイルの拡張子
file_search(dir_path, extension);
}
public static void file_search(String path, String extension){
File dir = new File(path);
File files[] = dir.listFiles();
for(int i=0; i<files.length; i++){
String file_name = files[i].getName();
if(files[i].isDirectory()){  //ディレクトリなら再帰を行う
file_search(path+"/"+file_name, extension);
}else{
if(file_name.endsWith(extension)){  //file_nameの最後尾(拡張子)が指定のものならば出力
System.out.println(path+"/"+file_name);
}
}
}
}
}
*/














