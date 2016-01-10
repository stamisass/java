package il.ac.shenkar.xml;

import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;

public class GUI implements Runnable {

	private JFrame frame;
	private JPanel panelEast, panelWest;
	private JButton buttonCalc, buttonUpdate;
	private JComboBox<String> comboFrom, comboTo;
	private JTextField textDate, textResult, textAmount;
	private JScrollPane scrollPane;
	private JTable table;
	private String[] headers = { "Name", "Unit", "Currency Code", "Country",
			"Rate", "Change" };
	private String[][] currencies;
	private Data data;
	private String[] currncyCode;
	private ActionListener listner;
	private JLabel lableFrom, lableTo, lableDate, lableAmount;

	public GUI(Data data) {
		this.data = data;
		setCurrencies();
		table = new JTable(currencies, headers);
		comboFrom = new JComboBox<String>(currncyCode);
		comboTo = new JComboBox<String>(currncyCode);
		frame = new JFrame("Currency Exchange");
		panelWest = new JPanel();
		panelEast = new JPanel();
		buttonCalc = new JButton("Calculate");
		buttonUpdate = new JButton("Update");
		textDate = new JTextField(data.getDate());
		textResult = new JTextField(5);
		textAmount = new JTextField(5);
		lableFrom = new JLabel(" From");
		lableTo = new JLabel(" To");
		lableDate = new JLabel(" Date");
		lableAmount = new JLabel(" Amount");
		scrollPane = new JScrollPane();
		listner = new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {

				if (e.getSource() == buttonCalc) {
					try {
						double amount = Double
								.parseDouble(textAmount.getText());
						int from = comboFrom.getSelectedIndex();
						double fromUnit = Double
								.parseDouble(currencies[from][1]);
						double fromRate = Double
								.parseDouble(currencies[from][4]);
						int to = comboTo.getSelectedIndex();
						double toUnit = Double.parseDouble(currencies[to][1]);
						double toRate = Double.parseDouble(currencies[to][4]);
						if (fromUnit != 0 && toUnit != 0) {
							double fromToNIS = amount * fromRate / fromUnit;
							double toToNIS = toRate / toUnit;
							textResult.setText(String.valueOf(fromToNIS
									/ toToNIS));
							Main.logger.info(  textAmount.getText()+" " + comboFrom.getSelectedItem() + " = " +  String.valueOf(fromToNIS
									/ toToNIS)+" " + comboTo.getSelectedItem() );
						} else {
							throw new NumberFormatException();
						}

					} catch (NumberFormatException exc) {
						textResult.setText("Error");
						Main.logger.error("Error");
					}
				}
			}

		};
	}

	private void setCurrencies() {
		List<Currency> list = data.getCurrencies();
		currencies = new String[list.size()][6];
		currncyCode = new String[list.size()];
		Currency c = null;
		for (int j = 0; j < list.size(); j++) {
			c = list.get(j);
			currncyCode[j] = c.getCurrenyCode();
			currencies[j][0] = c.getName();
			currencies[j][1] = c.getUnit();
			currencies[j][2] = c.getCurrenyCode();
			currencies[j][3] = c.getCountry();
			currencies[j][4] = c.getRate();
			currencies[j][5] = c.getChange();
		}

	}

	@Override
	public void run() {
		table.setFillsViewportHeight(true);
		table.setEnabled(false);
		buttonCalc.addActionListener(listner);
		buttonUpdate.addActionListener(listner);
		frame.setLayout(new BorderLayout());
		frame.addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent event) {
				frame.setVisible(false);
				frame.dispose();
				System.exit(0);
			}
		});
		textDate.setEditable(false);
		textResult.setEditable(false);
		textAmount.setEditable(true);
		scrollPane
				.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		scrollPane
				.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
		scrollPane.getViewport().add(table);
		panelEast.setLayout(new FlowLayout());
		panelEast.add(table);
		panelWest.setLayout(new GridLayout(5, 2));

		panelWest.add(lableDate);
		panelWest.add(textDate);
		panelWest.add(lableAmount);
		panelWest.add(textAmount);
		panelWest.add(lableFrom);
		panelWest.add(comboFrom);
		panelWest.add(lableTo);
		panelWest.add(comboTo);
		panelWest.add(buttonCalc);
		panelWest.add(textResult);

		frame.add(panelWest, BorderLayout.WEST);
		frame.add(panelEast, BorderLayout.EAST);
		frame.setSize(670, 300);
		frame.setVisible(true);
	}

}
