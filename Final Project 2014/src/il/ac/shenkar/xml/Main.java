package il.ac.shenkar.xml;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.FileAppender;
import org.apache.log4j.Logger;
import org.apache.log4j.SimpleLayout;

public class Main {

	static Logger logger = Logger.getLogger("MainLogger");
 

	public static void main(String[] args) {
		
		BasicConfigurator.configure();
		try
		{
			logger.addAppender(new FileAppender(new SimpleLayout(),"log.txt"));
		}
		catch(IOException e)
		{
		e.printStackTrace();
		}
   
        Data data = new Data();
		XMLParser xml = new XMLParser(data);
		Thread t1 = new Thread(xml);

		t1.start();
		try {
			t1.join();
		} catch (InterruptedException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			
		}

		GUI gui = new GUI(data);
		Thread t2 = new Thread(gui);
		t2.start();

		while (true) {
			if (!upToDate()) {
				t1.run();
				t2.run();
			}
		}

	}

	private static boolean upToDate() {
		URL url = null;
		InputStream is = null;
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = null;
		Document doc = null;

		URL url2 = null;
		InputStream is2 = null;
		DocumentBuilderFactory factory2 = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder2 = null;
		Document doc2 = null;

		String fileDate = null;
		String dataDate = null;
		try {

			url = new File("C:\\LastUpdate.xml").toURI().toURL();
			is = url.openStream();

			builder = factory.newDocumentBuilder();
			doc = builder.parse(is);
			NodeList dateList = doc.getElementsByTagName("LAST_UPDATE");

			fileDate = dateList.item(0).getFirstChild().getNodeValue();

		} catch (IOException | ParserConfigurationException | SAXException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		}

		try {

			url2 = new URL("http://www.boi.org.il/currency.xml");
			is2 = url2.openStream();

			builder2 = factory.newDocumentBuilder();
			doc2 = builder2.parse(is2);
			NodeList dateList2 = doc2.getElementsByTagName("LAST_UPDATE");

			dataDate = dateList2.item(0).getFirstChild().getNodeValue();

		} catch (IOException | ParserConfigurationException | SAXException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		}

		if (0 == dataDate.compareTo(fileDate)) {
			return true;
		}

		return false;

	}

}
