<?php

namespace Xpressengine\Extra\Cubrid;

use Illuminate\Database\Schema\Builder;

class CubridBuilder extends Builder

{
    /**
     * Determine if the given table exists.
     *
     * @param  string  $table
     * @return bool
     */
    public function hasTable($table)
    {
        $sql = $this->grammar->compileTableExists();

        $table = $this->connection->getTablePrefix().$table;

        return count($this->connection->select($sql, [$table])) > 0;
    }

    /**
     * Get the column listing for a given table.
     *
     * @param  string  $table
     * @return array
     */
    public function getColumnListing($table)
    {
        $sql = $this->grammar->compileColumnExists();

        $table = $this->connection->getTablePrefix().$table;

        $results = $this->connection->select($sql, [$table]);

        $ret = $this->connection->getPostProcessor()->processColumnListing($results);
        $list = [];
        if ($ret == false) {
            return $list;
        }
        foreach ($ret as $val) {
            $list[] = $val->column_name;
        }

        return $list;
    }
}
