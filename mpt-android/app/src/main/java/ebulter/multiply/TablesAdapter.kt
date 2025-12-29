package ebulter.multiply

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import ebulter.multiply.databinding.ItemTableBinding

class TablesAdapter(private val tables: List<String>, private val onTableClicked: (String) -> Unit) :
    RecyclerView.Adapter<TablesAdapter.TableViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TableViewHolder {
        val binding = ItemTableBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TableViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TableViewHolder, position: Int) {
        val table = tables[position]
        holder.binding.tableButton.text = table
        holder.binding.tableButton.setOnClickListener { onTableClicked(table) }
    }

    override fun getItemCount() = tables.size

    class TableViewHolder(val binding: ItemTableBinding) : RecyclerView.ViewHolder(binding.root)
}