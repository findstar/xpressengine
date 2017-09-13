<?php
/**
 * Extra Cubrid Connection object class
 *
 * PHP version 5
 *
 * @category    Extra
 * @package     Xpressengine\Extra\Cubrid
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */
namespace Xpressengine\Extra\Cubrid;

use Illuminate\Database\Connection;
use Illuminate\Database\Query\Processors\Processor;
use PDO;

class CubridConnection extends Connection
{
    protected $config;

    protected $pdo;

    protected $tablePrefix;

    protected $database;

    public function __construct(array $config)
    {
        $this->config = $config;

        $this->tablePrefix = $config['prefix'];

        $this->database = $config['database'];

        $dsn = $this->getDsn($config);

        $this->pdo = $this->createConnection($dsn, $config);

        $this->useDefaultPostProcessor();

        $this->useDefaultSchemaGrammar();

        $this->useDefaultQueryGrammar();

    }

    /**
     * Get a schema builder instance for the connection.
     *
     * @return CubridBuilder
     */
    public function getSchemaBuilder()
    {
        if (is_null($this->schemaGrammar)) {
            $this->useDefaultSchemaGrammar();
        }

        return new CubridBuilder($this);
    }

    /**
     * Get the default query grammar instance.
     *
     */
    protected function getDefaultQueryGrammar()
    {
        return $this->withTablePrefix(new CubridQueryGrammar);
    }

    /**
     * Get the default schema grammar instance.
     *
     */
    protected function getDefaultSchemaGrammar()
    {
        return $this->withTablePrefix(new CubridSchemaGrammar);
    }

    /**
     * Get the default post processor instance.
     *
     * @return \Illuminate\Database\Query\Processors\Processor
     */
    protected function getDefaultPostProcessor()
    {
        return new Processor;
    }

    private function getDsn($config)
    {
        // Check if the user passed a complete dsn to the configuration.
        if (! empty($config['dsn'])) {
            return $config['dsn'];
        }
        return "cubrid:dbname=".$config['database'].";host=".$config['host'].";port=".$config['port'];
    }

    private function createConnection($dsn, $config)
    {
        return new PDO($dsn, $config['username'], $config['password']);
    }

}
